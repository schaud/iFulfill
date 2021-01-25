export class Issue{
  id?: string;
  title?: string;
  description?: string;
  reported_at?: string;
  reported_by?: string;
  created_at?: string;
  criticality?: string;
  verified_by?: string;
  target_date?: string;
  closure_date?: string;
  status?: string;
  pending_with?: string[];
  system?: string;
}
export default Issue;
