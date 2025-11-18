from graph.services.graph_service import GraphService

class GraphController:

    @staticmethod
    async def view_graph(user_id: str):
        nodes, edges = await GraphService.get_graph(user_id)

        return {
            "nodes": [
                {
                    "id": str(n.id),
                    "type": n.type,
                    "title": n.title,
                    "source": n.source,
                    "metadata": n.node_metadata
                }
                for n in nodes
            ],
            "edges": [
                {
                    "id": str(e.id),
                    "source": str(e.from_node_id),
                    "target": str(e.to_node_id),
                    "type": e.type
                }
                for e in edges
            ]
        }
