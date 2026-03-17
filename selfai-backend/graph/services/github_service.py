import httpx

class GitHubService:
    BASE_URL = "https://api.github.com"

    @staticmethod
    async def fetch_repos(username: str):
        async with httpx.AsyncClient() as client:
            url = f"{GitHubService.BASE_URL}/users/{username}/repos"
            response = await client.get(url)

            if response.status_code != 200:
                raise Exception(f"GitHub fetch failed: {response.text}")

            return response.json()
