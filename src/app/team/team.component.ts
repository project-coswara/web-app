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
    'institution': 'IISc Bangalore'
  }, {
    'id': 'pkg',
    'name': 'Dr. Prasanta Kumar Ghosh',
    'designation': 'Associate Professor',
    'institution': 'IISc Bangalore'
  }]

  peopleList = [{
    'id': 'anandmoghan',
    'name': 'Anand',
    'designation': 'Alumni',
    'institution': 'IISc Bangalore'
  }, {
    'id': 'anuroop',
    'name': 'Anuroop',
    'designation': 'CEO',
    'institution': 'Cogknit'
  }, {
    'id': 'neeraj',
    'name': 'Neeraj',
    'designation': 'Alumni',
    'institution': 'IISc Bangalore'
  }, {
    'id': 'prashant',
    'name': 'Prashant',
    'designation': 'Research Assistant',
    'institution': 'IISc Bangalore'
  }, {
    'id': 'shahbaz',
    'name': 'Shahbaz',
    'designation': 'Developer',
    'institution': 'Cogknit'
  }, {
    'id': 'shreyas',
    'name': 'Shreyas',
    'designation': 'PhD Scholar',
    'institution': 'IISc Bangalore'
  }, {
    'id': 'srikanth',
    'name': 'Srikanth',
    'designation': 'Post Doc',
    'institution': 'IISc Bangalore'
  }]

  constructor() { }

  ngOnInit() {
  }

}
