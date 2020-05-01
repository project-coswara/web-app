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
    'areas': 'Speech Recognition, Deep Learning, Neuroscience',
    'image': 'sriram.jpg'
  }, {
    'id': 'pkg',
    'name': 'Dr. Prasanta Kumar Ghosh',
    'designation': 'Associate Professor',
    'institution': 'IISc Bangalore',
    'areas': 'Speech Production, Articulation, Speech Disorders',
    'image': 'pkg.jpg'
  }]

  peopleList = [{
    'id': 'anandmoghan',
    'name': 'Anand Mohan',
    'designation': 'MTech (Artificial Intelligence)',
    'institution': 'IISc Bangalore',
    'areas': 'Speech Recognition',
    'image': 'anand.png'
  }, {
    'id': 'anuroop',
    'name': 'Anuroop Iyengar',
    'designation': 'CEO',
    'institution': 'Cogknit Semantics',
    'image': 'anuroop.jpg'
  }, {
    'id': 'neeraj',
    'name': 'Dr. Neeraj Sharma',
    'designation': 'Postdoctoral Fellow',
    'institution': 'CMU, USA',
    'areas': 'Auditory Neuroscience, Signal Processing',
    'image': 'neeraj.jpeg'
  }, {
    'id': 'prashant',
    'name': 'Prashant Krishnan',
    'designation': 'Research Assistant',
    'institution': 'IISc Bangalore',
    'areas': 'Speaker Recognition',
    'image': 'prashant.jpeg'
  }, {
    'id': 'nirmala',
    'name': 'Dr. R. Nirmala',
    'designation': 'Medical Officer',
    'institution': 'IISc Bangalore',
    'image': 'nirmala.jpg'
  }, {
    'id': 'raksheet',
    'name': 'Raksheet Bhat',
    'designation': 'Software Engineer',
    'institution': 'upGrad',
    'image': 'raksheet.jpg'
  }, {
    'id': 'shahbaz',
    'name': 'Shahbaz Sultan',
    'designation': 'Developer',
    'institution': 'Cogknit Semantics',
    'image': 'shahbaz.jpg'
  }, {
    'id': 'shreyas',
    'name': 'Shreyas Ramoji',
    'designation': 'PhD Scholar',
    'institution': 'IISc Bangalore',
    'areas': 'Speaker Recognition, Machine Learning',
    'image': 'shreyas.jpg'
  }, {
    'id': 'srikanth',
    'name': 'Srikanth Raj Chetupalli',
    'designation': 'Postdoctoral Fellow',
    'institution': 'IISc Bangalore',
    'areas': 'Signal Processing, Speech Recognition',
    'image': 'srikanth.png'
  }]

  constructor() { }

  ngOnInit() {
  }

}
