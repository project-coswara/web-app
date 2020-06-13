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
    'designation': 'asst_prof',
    'institution': 'iisc',
    'image': 'sriram.jpg'
  }, {
    'id': 'pkg',
    'name': 'Dr. Prasanta Kumar Ghosh',
    'designation': 'assoc_prof',
    'institution': 'iisc',
    'image': 'pkg.jpg'
  }]

  peopleList = [{
    'id': 'anand',
    'name': 'Anand Mohan',
    'designation': 'mtech_ai',
    'institution': 'iisc',
    'image': 'anand.png'
  }, {
    'id': 'anuroop',
    'name': 'Anuroop Iyengar',
    'designation': 'ceo',
    'institution': 'cogknit',
    'image': 'anuroop.jpg'
  }, {
    'id': 'neeraj',
    'name': 'Dr. Neeraj Sharma',
    'designation': 'post_doc',
    'institution': 'cmu',
    'image': 'neeraj.jpeg'
  }, {
    'id': 'prashant',
    'name': 'Prashant Krishnan',
    'designation': 'ra',
    'institution': 'iisc',
    'image': 'prashant.jpeg'
  }, {
    'id': 'nirmala',
    'name': 'Dr. R. Nirmala',
    'designation': 'mo',
    'institution': 'iisc',
    'image': 'nirmala.jpg'
  }, {
    'id': 'raksheet',
    'name': 'Raksheet Bhat',
    'designation': 'sde',
    'institution': 'upgrad',
    'image': 'raksheet.jpg'
  }, {
    'id': 'shahbaz',
    'name': 'Shahbaz Sultan',
    'designation': 'sde',
    'institution': 'cogknit',
    'image': 'shahbaz.jpg'
  }, {
    'id': 'shreyas',
    'name': 'Shreyas Ramoji',
    'designation': 'phd',
    'institution': 'iisc',
    'image': 'shreyas.jpg'
  }, {
    'id': 'srikanth',
    'name': 'Srikanth Raj Chetupalli',
    'designation': 'post_doc',
    'institution': 'iisc',
    'image': 'srikanth.png'
  }]

  constructor() { }

  ngOnInit() {
  }

}
