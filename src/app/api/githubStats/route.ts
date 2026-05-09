import { NextRequest, NextResponse } from 'next/server';

interface GitHubRepo {
  stargazers_count?: number;
}

interface GitHubUser {
  public_repos?: number;
  followers?: number;
  following?: number;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  payload?: {
    commits?: Array<{ message: string }>;
  };
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: ContributionWeek[];
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

function countFromEvents(events: GitHubEvent[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  let todayCommits = 0;
  let weekCommits = 0;
  let yearCommits = 0;

  for (const event of events) {
    if (event.type !== 'PushEvent') continue;

    const commitDate = new Date(event.created_at);
    const commitCount = event.payload?.commits?.length || 0;

    if (commitDate >= todayStart) {
      todayCommits += commitCount;
    }
    if (commitDate >= weekStart) {
      weekCommits += commitCount;
    }
    if (commitDate >= yearStart) {
      yearCommits += commitCount;
    }
  }

  return { todayCommits, weekCommits, yearCommits };
}

function countFromContributionDays(days: ContributionDay[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  let todayCommits = 0;
  let weekCommits = 0;
  let yearCommits = 0;

  for (const day of days) {
    const date = new Date(day.date);
    const count = day.contributionCount || 0;

    if (date >= todayStart) {
      todayCommits += count;
    }
    if (date >= weekStart) {
      weekCommits += count;
    }
    if (date >= yearStart) {
      yearCommits += count;
    }
  }

  return { todayCommits, weekCommits, yearCommits };
}

async function fetchContributionCounts(username: string, token: string) {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();

  const query = `
    query UserContributions($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        from: yearStart,
        to: now.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed: ${response.status}`);
  }

  const data = (await response.json()) as GraphQLResponse;

  if (data.errors?.length) {
    throw new Error(data.errors[0]?.message || 'GitHub GraphQL returned errors');
  }

  const days =
    data.data?.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.flatMap(week => week.contributionDays)
      .filter(Boolean) || [];

  return countFromContributionDays(days);
}

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username') || 'Muzammil327';
    const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    const headers: HeadersInit = {
      Accept: 'application/vnd.github+json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
      fetch(`https://api.github.com/users/${username}/events?per_page=100`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch GitHub profile statistics.',
        },
        { status: 502 }
      );
    }

    const userData = (await userRes.json()) as GitHubUser;
    const reposData = (await reposRes.json()) as GitHubRepo[];
    const eventsData = eventsRes.ok ? ((await eventsRes.json()) as GitHubEvent[]) : [];

    const totalStars = Array.isArray(reposData)
      ? reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
      : 0;

    let commitCounts = countFromEvents(Array.isArray(eventsData) ? eventsData : []);

    if (token) {
      try {
        commitCounts = await fetchContributionCounts(username, token);
      } catch (graphqlError) {
        console.warn('Falling back to event-based commit counts:', graphqlError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        repos: userData.public_repos || 0,
        stars: totalStars,
        followers: userData.followers || 0,
        following: userData.following || 0,
        todayCommits: commitCounts.todayCommits,
        weekCommits: commitCounts.weekCommits,
        yearCommits: commitCounts.yearCommits,
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching GitHub stats:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to fetch GitHub stats right now.',
      },
      { status: 500 }
    );
  }
}
