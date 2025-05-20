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

export interface TrendDataItem {
  date: string;
  visitors: number;
}

export interface TrendDataResponse {
  min_count: number;
  max_count: number;
  data: TrendDataItem[];
  period: {
    start: string;
    end: string;
  };
}

export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface ChartSeries {
  id: string;
  color: string;
  data: ChartDataPoint[];
}
