export class Issue {
  id?: string;
  title?: string;
  description?: string;
  reported_at?: string;
  reported_by?: string;
  criticality?: string;
  verified_by?: string;
  target_date?: string;
  closure_date?: string;
  status?: string;
  pending_with?: string[];
  system?: string;

  constructor(
    id?: string,
    title?: string,
    description?: string,
    reported_at?: string,
    reported_by?: string,
    criticality?: string,
    verified_by?: string,
    target_date?: string,
    closure_date?: string,
    status?: string,
    pending_with?: string[],
    system?: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.reported_at = reported_at;
    this.reported_by = reported_by;
    this.criticality = criticality;
    this.verified_by = verified_by;
    this.target_date = target_date;
    this.closure_date = closure_date;
    this.status = status;
    this.pending_with = pending_with;
    this.system = system;
  }
}
