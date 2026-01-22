import base64
import httpx
from typing import Any, Dict, List, Optional

class GitHubClient:
    BASE = "https://api.github.com"

    def __init__(self, token: str):
        self.token = token

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json",
        }

    async def get_viewer(self) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(f"{self.BASE}/user", headers=self._headers())
            r.raise_for_status()
            return r.json()

    async def list_repos(self, per_page: int = 50) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{self.BASE}/user/repos",
                headers=self._headers(),
                params={"sort": "updated", "per_page": per_page},
            )
            r.raise_for_status()
            return r.json()

    async def get_readme_text(self, owner: str, repo: str) -> Optional[str]:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/readme",
                headers=self._headers(),
            )
            if r.status_code == 404:
                return None
            r.raise_for_status()
            data = r.json()
            if data.get("encoding") == "base64" and "content" in data:
                return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
            return None