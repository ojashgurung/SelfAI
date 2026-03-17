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
            

    def _relationship(self, *, viewer_login: str, repo: Dict[str, Any]) -> str:
        owner_login = (repo.get("owner") or {}).get("login")
        is_fork = bool(repo.get("fork"))

        # Strong ownership signal
        if owner_login and viewer_login and owner_login.lower() == viewer_login.lower():
            return "owner"

        # Collaborator/contributor signal (only sometimes present)
        perms = repo.get("permissions") or {}
        if perms.get("push") or perms.get("admin") or perms.get("maintain") or perms.get("triage"):
            return "collaborator"

        if is_fork:
            return "fork"

        return "external"

    async def list_repos(self, viewer_login: str, per_page: int = 50) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{self.BASE}/user/repos",
                headers=self._headers(),
                params={
                    "sort": "updated",
                    "per_page": per_page,
                    # optional: "affiliation": "owner,collaborator,organization_member"
                },
            )
            r.raise_for_status()
            repos = r.json()

        # Enrich repos with attribution metadata
        enriched = []
        for repo in repos:
            owner_login = (repo.get("owner") or {}).get("login")
            repo["repo_owner"] = owner_login
            repo["repo_full_name"] = repo.get("full_name")
            repo["relationship_to_user"] = self._relationship(viewer_login=viewer_login, repo=repo)
            enriched.append(repo)

        return enriched

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