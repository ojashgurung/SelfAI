from datetime import datetime
from typing import List, Optional

from graph.ingestors.base import IngestPayload, IngestedDocument
from graph.integrations.github.client import GitHubClient

def _parse_dt(s: Optional[str]) -> Optional[datetime]:
    if not s:
        return None
    try:
        # Return offset-naive UTC datetime
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        return dt.astimezone(datetime.timezone.utc).replace(tzinfo=None) if dt else None
    except Exception:
        return None

class GitHubIngestor:
    platform = "github"

    def __init__(self, client: GitHubClient):
        self.client = client

    async def ingest(
        self,
        *,
        username: str,
        top_n: int = 15,
        sort_by: str = "updated"  # "updated" | "stars"
    ) -> IngestPayload:
        # Fetch more candidates (up to 100) to ensure we can fill top_n even if some lack READMEs
        repos = await self.client.list_repos(per_page=100)

        if sort_by == "stars":
            repos.sort(key=lambda r: r.get("stargazers_count", 0), reverse=True)
        else:
            repos.sort(key=lambda r: r.get("pushed_at") or "", reverse=True)

        docs: List[IngestedDocument] = []

        for repo in repos:
            # Stop if we have enough documents
            if len(docs) >= top_n:
                break

            repo_name = repo["name"]
            owner = repo["owner"]["login"]
            readme = await self.client.get_readme_text(owner, repo_name)
            if not readme:
                continue

            docs.append(
                IngestedDocument(
                    external_id=f"github:repo:{owner}/{repo_name}:readme",
                    doc_type="readme",
                    title=f"{repo_name} README",
                    text=readme,
                    url=repo.get("html_url"),
                    updated_at_source=_parse_dt(repo.get("pushed_at")),
                    metadata={
                        "repo": repo_name,
                        "owner": owner,
                        "full_name": repo.get("full_name"),
                        "stars": repo.get("stargazers_count"),
                        "forks": repo.get("forks_count"),
                        "language": repo.get("language"),
                        "description": repo.get("description"),
                    },
                )
            )

        return IngestPayload(
            platform="github",
            account_id=username,
            display_name=f"{username}'s GitHub",
            source_metadata={"top_n": top_n, "sort_by": sort_by},
            documents=docs,
        )