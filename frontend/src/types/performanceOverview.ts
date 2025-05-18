interface QueriesProps {
  total_queries: number;
  current: number;
  previous: number;
  growth: number;
}

interface VisitorsProps {
  total_visitors: number;
  current: number;
  previous: number;
  growth: number;
}

export interface PerformanceOverviewProps {
  queries: QueriesProps;
  visitors: VisitorsProps;
  since: Date | null;
}
