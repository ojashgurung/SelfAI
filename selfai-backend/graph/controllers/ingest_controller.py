# function ingest_github_repo() — create a user node first, then edges from it
from core.database.db import AsyncSessionLocal
from graph.services.github_service import GitHubService
from graph.services.node_service import NodeService
from graph.services.edge_service import EdgeService
from sqlmodel.ext.asyncio.session import AsyncSession

async def ingest_github_repo(user_id: str, username: str):
    repos = await GitHubService.fetch_repos(username)

    created_nodes = []

    async with AsyncSessionLocal() as session:
        user_node = await NodeService.get_or_create_user_node(
            session=session,
            user_id=user_id,
            username=username
        )

        for repo in repos:
            node = await NodeService.create_node(
                session=session,
                user_id=user_id,
                type="github_repo",
                title=repo["name"],
                source="github",
                metadata={
                    "url": repo["html_url"],
                    "description": repo.get("description"),
                    "language": repo.get("language"),
                    "stars": repo.get("stargazers_count"),
                    "forks": repo.get("forks_count"),
                }
            )
            created_nodes.append(node)

            await EdgeService.create_edge(
                session=session,
                user_id=user_id,
                from_id=user_node.id,
                to_id=node.id,
                type="owns"
            )

    return {
        "status": "success",
        "repos_imported": len(created_nodes)
    }
