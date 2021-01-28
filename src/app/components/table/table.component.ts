import {OnInit, AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewIssuePopupComponent } from '../../components/dialogs/new-issue-popup/new-issue-popup.component';

export interface Layout {
  id: number;
  title: string;
  name: string;
  date: string;
  status: string;
  criticality: string;
}

const ELEMENT_DATA: Layout[] = [
  {id: 1, title: 'Sample 1', name: 'Sharjeel Chaudhry', date:'01/05/2021', status: 'Open', criticality: 'Low'},
  {id: 2, title: 'Sample 2', name: 'Jian Qiu', date:'01/07/2021', status: 'Closed', criticality: 'High'},
  {id: 3, title: 'Sample 3', name: 'Wael Dawoud', date:'01/11/2021', status: 'Open', criticality: 'Severe'},
  {id: 4, title: 'Sample 4', name: 'Tejas Ramani', date:'01/03/2021', status: 'Closed', criticality: 'Severe'},
  {id: 5, title: 'Sample 5', name: 'Sharjeel Chaudhry', date:'01/15/2021', status: 'Closed', criticality: 'Severe'},
  {id: 6, title: 'Sample 6', name: 'Jian Qiu', date:'01/22/2021', status: 'Open', criticality: 'Low'},
  {id: 7, title: 'Sample 7', name: 'Wael Dawoud', date:'01/12/2021', status: 'Closed', criticality: 'Low'},
  {id: 8, title: 'Sample 8', name: 'Tejas Ramani', date:'01/16/2021', status: 'Closed', criticality: 'High'},
];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['id', 'title', 'name', 'date', 'status', 'criticality'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openNewIssue(): void {
    let dialogRef = this.dialog.open(NewIssuePopupComponent, {

      data: {

      }
    })
  }


}


