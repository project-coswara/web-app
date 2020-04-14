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
    'institution': 'IISc Bangalore',
    'areas': 'Speech Recognition, Deep Learning, Neuroscience'
  }, {
    'id': 'pkg',
    'name': 'Dr. Prasanta Kumar Ghosh',
    'designation': 'Associate Professor',
    'institution': 'IISc Bangalore',
    'areas': 'Speech Production, Articulation, Speech Disorders'
  }]

  peopleList = [{
    'id': 'anandmoghan',
    'name': 'Anand',
    'designation': 'Alumni',
    'institution': 'IISc Bangalore',
    'areas': 'Speech Recognition',
    'image': 'anand.jpeg'
  }, {
    'id': 'anuroop',
    'name': 'Anuroop',
    'designation': 'CEO',
    'institution': 'Cogknit'
  }, {
    'id': 'neeraj',
    'name': 'Neeraj',
    'designation': 'Alumni',
    'institution': 'IISc Bangalore',
    'image': 'neeraj.jpeg'
  }, {
    'id': 'prashant',
    'name': 'Prashant',
    'designation': 'Research Assistant',
    'institution': 'IISc Bangalore',
    'image': 'prashant.jpeg'
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
