import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cs-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.less']
})
export class TeamComponent implements OnInit {
  mentorsList = [{
    'id': 'sriram',
    'name': 'Dr. Sriram Ganapathy',
    'designation': 'Assistant Professor',
    'institution': 'IISc'
  }, {
    'id': 'pkg',
    'name': 'Dr. Prasanta Kumar Ghosh',
    'designation': 'Associate Professor',
    'institution': 'IISc'
  }]

  peopleList = [{
    'id': 'anandmoghan',
    'name': 'Anand',
    'designation': 'Alumni',
    'institution': 'IISc'
  }, {
    'id': 'anuroop',
    'name': 'Anuroop',
    'designation': 'CEO',
    'institution': 'Cogknit'
  }, {
    'id': 'neeraj',
    'name': 'Neeraj',
    'designation': 'Alumni',
    'institution': 'IISc'
  }, {
    'id': 'prashant',
    'name': 'Prashant',
    'designation': 'Research Assistant',
    'institution': 'IISc'
  }, {
    'id': 'shahbaz',
    'name': 'Shahbaz',
    'designation': 'Developer',
    'institution': 'Cogknit'
  }, {
    'id': 'shreyas',
    'name': 'Shreyas',
    'designation': 'PhD Scholar',
    'institution': 'IISc'
  }, {
    'id': 'srikanth',
    'name': 'Srikanth',
    'designation': 'Post Doc',
    'institution': 'IISc'
  }]

  constructor() { }

  ngOnInit() {
  }

}
