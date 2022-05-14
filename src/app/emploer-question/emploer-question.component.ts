import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-emploer-question',
  templateUrl: './emploer-question.component.html',
  styleUrls: []
})
export class EmploerQuestionComponent implements OnInit {

  constructor( private http: HttpClient,private ref: ChangeDetectorRef, private route: ActivatedRoute,
    private router: Router,private httpService: HttpService, private toaster: ToasterService,private sessionService: SessionService) { }
  currentIndex:number =0;
  fieldArray:any=[];
  answers:any=[];
  employeeQuestionData:any=[];
  public width = 0;
  type={
    select:"select",
    textarea:"textarea",
    selectBox:"selectBox",
    multiselect:"multiselect",
    techquestion:"techquestion",
    selectYesNo:"selectYesNo",
  }
  firstOption=false;
  disableNextButton:boolean = true;
  filterString:any='';
  buttonDataFilter='';
  enterpriseApplicationGroup='';
  enterpriseApplicationSubGroup:any=[];
  showTechQuestion:boolean = false;
  countries:any;
  selectedCountry:any;
  industryGroup=[
    {
        "value": "Administrative Services",
        "selected": false
    },
    {
        "value": "Advertising",
        "selected": false
    },
    {
        "value": "Agriculture and Farming",
        "selected": false
    },
    {
        "value": "Apps",
        "selected": false
    },
    {
        "value": "Artificial Intelligence",
        "selected": false
    },
    {
        "value": "Biotechnology",
        "selected": false
    },
    {
        "value": "Clothing and Apparel",
        "selected": false
    },
    {
        "value": "Commerce and Shopping",
        "selected": false
    },
    {
        "value": "Consumer Electronics",
        "selected": false
    },
    {
        "value": "Consumer Goods",
        "selected": false
    },
    {
        "value": "Content and Publishing",
        "selected": false
    },
    {
        "value": "Data and Analytics",
        "selected": false
    },
    {
        "value": "Design",
        "selected": false
    },
    {
        "value": "Education",
        "selected": false
    },
    {
        "value": "Energy",
        "selected": false
    },
    {
        "value": "Events",
        "selected": false
    },
    {
        "value": "Banking & Financial Services",
        "selected": false
    },
    {
        "value": "Food and Beverage",
        "selected": false
    },
    {
        "value": "Government and Military",
        "selected": false
    },
    {
        "value": "Hardware",
        "selected": false
    },
    {
        "value": "Health Care",
        "selected": false
    },
    {
        "value": "Information Technology",
        "selected": false
    },
    {
        "value": "Internet Services",
        "selected": false
    },
    {
        "value": "Lending and Investments",
        "selected": false
    },
    {
        "value": "Manufacturing",
        "selected": false
    },
    {
        "value": "Media and Entertainment",
        "selected": false
    },
    {
        "value": "Messaging and Telecommunications",
        "selected": false
    },
    {
        "value": "Mobile",
        "selected": false
    },
    {
        "value": "Oil,Gas and Chemicals",
        "selected": false
    },
    {
        "value": "Navigation and Mapping",
        "selected": false
    },
    {
        "value": "Other",
        "selected": false
    },
    {
        "value": "Payments",
        "selected": false
    },
    {
        "value": "Privacy and Security",
        "selected": false
    },
    {
        "value": "Professional Services",
        "selected": false
    },
    {
        "value": "Real Estate",
        "selected": false
    },
    {
        "value": "Sales and Marketing",
        "selected": false
    },
    {
        "value": "Science and Engineering",
        "selected": false
    },
    {
        "value": "Software",
        "selected": false
    },
    {
        "value": "Sports",
        "selected": false
    },
    {
        "value": "Sustainability",
        "selected": false
    },
    {
        "value": "Transportation",
        "selected": false
    },
    {
        "value": "Travel and Tourism",
        "selected": false
    },
    {
        "value": "Video",
        "selected": false
    },
    {
        "value": "Insurance",
        "selected": false
    },
    {
        "value": "Aerospace and Defense (A&D)",
        "selected": false
    },
    {
        "value": "Automotive",
        "selected": false
    },
    {
        "value": "Life science",
        "selected": false
    },
    {
        "value": "Utilities",
        "selected": false
    },
    {
        "value": "Distribution",
        "selected": false
    }
]
   industry = [
  {
      "value": "Archiving Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Call Center",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Collection Agency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "College Recruiting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Courier Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Debt Collections",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Delivery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Document Preparation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Employee Benefits",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Extermination Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Facilities Support Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Housekeeping Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Human Resources",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Knowledge Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Office Administration",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Packaging Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Physical Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Project Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Staffing Agency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Trade Shows",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Virtual Workforce",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Administrative Services"
  },
  {
      "value": "Ad Exchange",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Ad Network",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Ad Retargeting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Ad Server",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Ad Targeting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Advertising Platforms",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Affiliate Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Local Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Mobile Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Outdoor Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "SEM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Social Media Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Video Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Advertising"
  },
  {
      "value": "Agriculture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "AgTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Animal Feed",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Aquaculture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Equestrian",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Farming",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Forestry",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Horticulture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Hydroponics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Livestock",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Agriculture and Farming"
  },
  {
      "value": "App Discovery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Consumer Applications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Enterprise Applications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Mobile Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Reading Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Web Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Apps"
  },
  {
      "value": "Artificial Intelligence",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Artificial Intelligence"
  },
  {
      "value": "Intelligent Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Artificial Intelligence"
  },
  {
      "value": "Machine Learning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Artificial Intelligence"
  },
  {
      "value": "Natural Language Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Artificial Intelligence"
  },
  {
      "value": "Predictive Analytics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Artificial Intelligence"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Artificial Intelligence"
  },
  {
      "value": "Bioinformatics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Biometrics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Biopharma",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Biotechnology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Genetics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Life Science",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Neuroscience",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Quantified Self",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Biotechnology"
  },
  {
      "value": "Fashion",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Clothing and Apparel"
  },
  {
      "value": "Laundry and Dry-cleaning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Clothing and Apparel"
  },
  {
      "value": "Lingerie",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Clothing and Apparel"
  },
  {
      "value": "Shoes",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Clothing and Apparel"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Clothing and Apparel"
  },
  {
      "value": "Auctions",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Classifieds",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Collectibles",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Consumer Reviews",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Coupons",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "E-Commerce",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "E-Commerce Platforms",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Flash Sale",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Gift",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Gift Card",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Gift Exchange",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Gift Registry",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Group Buying",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Local Shopping",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Made to Order",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Marketplace",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Online Auctions",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Personalization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Point of Sale",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Price Comparison",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Rental",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Retail",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Retail Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Shopping",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Shopping Mall",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Social Shopping",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Sporting Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Vending and Concessions",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Virtual Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Wholesale",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Commerce and Shopping"
  },
  {
      "value": "Computer",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Consumer Electronics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Drones",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Electronics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Google Glass",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Mobile Devices",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Nintendo",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Playstation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Roku",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Smart Home",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Wearables",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Windows Phone",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Xbox",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Electronics"
  },
  {
      "value": "Beauty",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Comics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Consumer Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Cosmetics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "DIY",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Drones",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Eyewear",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Fast-Moving Consumer Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Flowers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Furniture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Green Consumer Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Handmade",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Jewelry",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Lingerie",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Shoes",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Tobacco",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Toys",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Consumer Goods"
  },
  {
      "value": "Blogging Platforms",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Content Delivery Network",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Content Discovery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Content Syndication",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Creative Agency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "DRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "EBooks",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Journalism",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "News",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Photo Editing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Photo Sharing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Photography",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Printing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Publishing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Social Bookmarking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Video Editing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Video Streaming",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Content and Publishing"
  },
  {
      "value": "A/B Testing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Analytics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Application Performance Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Artificial Intelligence",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Big Data",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Bioinformatics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Biometrics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Business Intelligence",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Consumer Research",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Data Integration",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Data Mining",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Data Visualization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Database",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Facial Recognition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Geospatial",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Image Recognition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Intelligent Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Location Based Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Machine Learning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Market Research",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Natural Language Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Predictive Analytics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Product Research",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Quantified Self",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Speech Recognition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Test and Measurement",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Text Analytics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Usability Testing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Data and Analytics"
  },
  {
      "value": "CAD",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Consumer Research",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Data Visualization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Fashion",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Graphic Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Human Computer Interaction",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Industrial Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Interior Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Market Research",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Mechanical Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Product Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Product Research",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Usability Testing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "UX Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Web Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Design"
  },
  {
      "value": "Alumni",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Charter Schools",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "College Recruiting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Continuing Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Corporate Training",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "E-Learning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "EdTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Edutainment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Higher Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Language Learning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "MOOC",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Music Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Personal Development",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Primary Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Secondary Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Skill Assessment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "STEM Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Textbook",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Training",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Tutoring",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Vocational Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Education"
  },
  {
      "value": "Battery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Biofuel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Biomass Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Clean Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Electrical Distribution",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Energy Efficiency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Energy Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Energy Storage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Fossil Fuels",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Fuel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Fuel Cell",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Oil and Gas",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Power Grid",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Renewable Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Solar",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Wind Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Energy"
  },
  {
      "value": "Concerts",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Events"
  },
  {
      "value": "Event Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Events"
  },
  {
      "value": "Event Promotion",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Events"
  },
  {
      "value": "Events",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Events"
  },
  {
      "value": "Reservations",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Events"
  },
  {
      "value": "Ticketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Events"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Events"
  },
  {
      "value": "Retail banking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Wholesale banking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Wealth management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Accounting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Angel Investment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Asset Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Auto Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Banking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Bitcoin",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Commercial Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Commercial Lending",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Consumer Lending",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Credit",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Credit Bureau",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Credit Cards",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Crowdfunding",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Cryptocurrency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Debit Cards",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Debt Collections",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Finance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Financial Exchanges",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Financial Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "FinTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Fraud Detection",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Funding Platform",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Gift Card",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Health Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Hedge Funds",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Impact Investing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Incubators",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "InsurTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Leasing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Lending",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Life Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Micro Lending",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Mobile Payments",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Payments",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Personal Finance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Prediction Markets",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Property Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Real Estate Investment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Stock Exchanges",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Trading Platform",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Transaction Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Venture Capital",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Virtual Currency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Wealth Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Banking & Financial Services"
  },
  {
      "value": "Bakery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Brewing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Catering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Coffee",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Confectionery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Cooking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Craft Beer",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Dietary Supplements",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Distillery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Farmers Market",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Food and Beverage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Food Delivery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Food Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Food Trucks",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Fruit",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Grocery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Nutrition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Organic Food",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Recipes",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Restaurants",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Seafood",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Snack Food",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Tea",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Tobacco",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Wine And Spirits",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Winery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Food and Beverage"
  },
  {
      "value": "CivicTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "Government",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "GovTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "Law Enforcement",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "Military",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "National Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "Politics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "Public Safety",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "Social Assistance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Government and Military"
  },
  {
      "value": "3D Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Application Specific Integrated Circuit (ASIC)",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Augmented Reality",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Cloud Infrastructure",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Communication Hardware",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Communications Infrastructure",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Computer",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Computer Vision",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Consumer Electronics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Data Center",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Data Center Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Data Storage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Drone Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Drones",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "DSP",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Electronic Design Automation (EDA)",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Electronics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Embedded Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Field-Programmable Gate Array (FPGA)",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Flash Storage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Google Glass",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "GPS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "GPU",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Hardware",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Industrial Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Laser",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Lighting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Mechanical Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Mobile Devices",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Network Hardware",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "NFC",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Nintendo",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Optical Communication",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Playstation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Private Cloud",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Retail Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "RFID",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "RISC",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Robotics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Roku",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Satellite Communication",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Semiconductor",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Sensor",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Sex Tech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Telecommunications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Video Conferencing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Virtual Reality",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Virtualization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Wearables",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Windows Phone",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Wireless",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Xbox",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Hardware"
  },
  {
      "value": "Alternative Medicine",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Assisted Living",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Assistive Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Child Care",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Clinical Trials",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Cosmetic Surgery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Dental",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Diabetes",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Dietary Supplements",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Elder Care",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Electronic Health Record (EHR)",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Emergency Medicine",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Employee Benefits",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Fertility",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "First Aid",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Health Care",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Health Diagnostics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Home Health Care",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Hospital",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Nursing and Residential Care",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Nutraceutical",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Nutrition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Outpatient Care",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Personal Health",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Psychology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Rehabilitation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Therapeutics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Veterinary",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Wellness",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Health Care"
  },
  {
      "value": "Business Information Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "CivicTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Cloud Data Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Cloud Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Cloud Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "CMS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Contact Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "CRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Cyber Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Data Center",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Data Center Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Data Integration",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Data Mining",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Data Visualization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Document Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "E-Signature",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Email",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "GovTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Identity Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Information and Communications Technology (ICT)",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Information Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Information Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Intrusion Detection",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "IT Infrastructure",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "IT Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Management Information Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Messaging",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Military",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Network Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Penetration Testing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Private Cloud",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Reputation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Sales Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Scheduling",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Social CRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Spam Filtering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Technical Support",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Unified Communications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Video Chat",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Video Conferencing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Virtualization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "VoIP",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Information Technology"
  },
  {
      "value": "Cloud Computing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Cloud Data Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Cloud Infrastructure",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Cloud Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Cloud Storage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Darknet",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Domain Registrar",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "E-Commerce Platforms",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Ediscovery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Email",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Internet",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Internet of Things",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "ISP",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Location Based Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Messaging",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Music Streaming",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Online Forums",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Online Portals",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Private Cloud",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Product Search",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Search Engine",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "SEM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Semantic Search",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Semantic Web",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "SEO",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "SMS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Social Media",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Social Media Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Social Network",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Unified Communications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Vertical Search",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Video Chat",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Video Conferencing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Visual Search",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "VoIP",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Web Browsers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Web Hosting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Internet Services"
  },
  {
      "value": "Angel Investment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Banking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Commercial Lending",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Consumer Lending",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Credit",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Credit Cards",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Financial Exchanges",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Funding Platform",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Hedge Funds",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Impact Investing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Incubators",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Micro Lending",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Stock Exchanges",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Trading Platform",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Venture Capital",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Lending and Investments"
  },
  {
      "value": "3D Printing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Advanced Materials",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Foundries",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Industrial",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Industrial Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Industrial Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Industrial Manufacturing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Machinery Manufacturing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Manufacturing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Paper Manufacturing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Plastics and Rubber Manufacturing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Textiles",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Wood Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Manufacturing"
  },
  {
      "value": "Advice",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Animation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Art",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Audio",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Audiobooks",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Blogging Platforms",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Broadcasting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Celebrity",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Concerts",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Content",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Content Creators",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Content Discovery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Content Syndication",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Creative Agency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Digital Entertainment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Digital Media",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "DRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "EBooks",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Edutainment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Event Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Event Promotion",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Events",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Film",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Film Distribution",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Film Production",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Guides",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "In-Flight Entertainment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Independent Music",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Internet Radio",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Journalism",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Media and Entertainment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Motion Capture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Music",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Music Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Music Label",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Music Streaming",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Music Venues",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Musical Instruments",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "News",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Nightclubs",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Nightlife",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Performing Arts",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Photo Editing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Photo Sharing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Photography",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Podcast",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Printing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Publishing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Reservations",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Social Media",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Social News",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Theatre",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Ticketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "TV",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "TV Production",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Video",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Video Editing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Video on Demand",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Video Streaming",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Virtual World",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Media and Entertainment"
  },
  {
      "value": "Email",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Meeting Software",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Messaging",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "SMS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Unified Communications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Video Chat",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Video Conferencing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "VoIP",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Wired Telecommunications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Messaging and Telecommunications"
  },
  {
      "value": "Android",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Google Glass",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "iOS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "mHealth",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Mobile",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Mobile Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Mobile Devices",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Mobile Payments",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Windows Phone",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Wireless",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Mobile"
  },
  {
      "value": "Biofuel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Biomass Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Fossil Fuels",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Mineral",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Mining",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Mining Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Natural Resources",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Oil and Gas",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Precious Metals",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Solar",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Timber",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Water",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Wind Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Oil,Gas and Chemicals"
  },
  {
      "value": "Geospatial",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Navigation and Mapping"
  },
  {
      "value": "GPS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Navigation and Mapping"
  },
  {
      "value": "Indoor Positioning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Navigation and Mapping"
  },
  {
      "value": "Location Based Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Navigation and Mapping"
  },
  {
      "value": "Mapping Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Navigation and Mapping"
  },
  {
      "value": "Navigation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Navigation and Mapping"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Navigation and Mapping"
  },
  {
      "value": "Alumni",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Association",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "B2B",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "B2C",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Blockchain",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Charity",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Collaboration",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Collaborative Consumption",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Commercial",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Consumer",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Crowdsourcing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Other"
  },
  {
      "value": "Billing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Bitcoin",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Credit Cards",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Cryptocurrency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Debit Cards",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Fraud Detection",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Mobile Payments",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Payments",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Transaction Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Virtual Currency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Payments"
  },
  {
      "value": "Cloud Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Corrections Facilities",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Cyber Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "DRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "E-Signature",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Fraud Detection",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Homeland Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Identity Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Intrusion Detection",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Law Enforcement",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Network Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Penetration Testing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Physical Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Privacy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Security",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Privacy and Security"
  },
  {
      "value": "Accounting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Business Development",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Career Planning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Compliance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Consulting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Customer Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Employment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Environmental Consulting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Field Support",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Freelance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Intellectual Property",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Innovation Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Legal",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Legal Tech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Management Consulting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Outsourcing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Professional Networking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Quality Assurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Recruiting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Risk Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Social Recruiting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Translation Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Professional Services"
  },
  {
      "value": "Architecture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Building Maintenance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Building Material",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Commercial Real Estate",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Construction",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Coworking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Facility Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Fast-Moving Consumer Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Green Building",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Home and Garden",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Home Decor",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Home Improvement",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Home Renovation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Home Services",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Interior Design",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Janitorial Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Landscaping",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Property Development",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Property Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Real Estate",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Real Estate Investment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Rental Property",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Residential",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Self-Storage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Smart Building",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Smart Cities",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Smart Home",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Timeshare",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Vacation Rental",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Real Estate"
  },
  {
      "value": "Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Affiliate Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "App Discovery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "App Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Brand Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Cause Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Content Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "CRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Digital Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Digital Signage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Direct Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Direct Sales",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Email Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Lead Generation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Lead Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Local",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Local Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Local Business",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Loyalty Programs",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Marketing Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Mobile Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Multi-level Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Outdoor Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Personal Branding",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Public Relations",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Sales",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Sales Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "SEM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "SEO",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Social CRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Social Media Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Social Media Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Social Media Marketing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Sponsorship",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Video Advertising",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sales and Marketing"
  },
  {
      "value": "Advanced Materials",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Aerospace",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Artificial Intelligence",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Bioinformatics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Biometrics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Biopharma",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Biotechnology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Chemical",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Chemical Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Civil Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Embedded Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Environmental Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Human Computer Interaction",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Industrial Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Industrial Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Intelligent Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Laser",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Life Science",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Marine Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Mechanical Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Nanotechnology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Neuroscience",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Nuclear",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Quantum Computing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Robotics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Semiconductor",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "Software Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "STEM Education",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Science and Engineering"
  },
  {
      "value": "3D Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Android",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "App Discovery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Application Performance Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Artificial Intelligence",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Augmented Reality",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Billing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Bitcoin",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Browser Extensions",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "CAD",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Cloud Computing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Cloud Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "CMS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Computer Vision",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Consumer Applications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Consumer Software",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Contact Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "CRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Cryptocurrency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Data Center Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Data Integration",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Data Storage",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Data Visualization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Database",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Developer APIs",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Developer Platform",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Developer Tools",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Document Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Drone Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "E-Learning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "EdTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Electronic Design Automation (EDA)",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Embedded Software",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Embedded Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Enterprise Applications",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Enterprise Resource Planning (ERP)",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Enterprise Software",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Facial Recognition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "File Sharing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "IaaS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Image Recognition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "iOS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Linux",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Machine Learning",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "macOS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Marketing Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Meeting Software",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Mobile Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Mobile Payments",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "MOOC",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Natural Language Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Open Source",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Operating Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "PaaS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Predictive Analytics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Presentation Software",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Presentations",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Private Cloud",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Productivity Tools",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "QR Codes",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Reading Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Retail Technology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Robotics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "SaaS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Sales Automation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Scheduling",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Sex Tech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Simulation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "SNS",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Social CRM",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Software",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Software Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Speech Recognition",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Task Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Text Analytics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Transaction Processing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Video Conferencing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Virtual Assistant",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Virtual Currency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Virtual Desktop",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Virtual Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Virtual Reality",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Virtual World",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Virtualization",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Web Apps",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Web Browsers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Web Development",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Software"
  },
  {
      "value": "American Football",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Baseball",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Basketball",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Boating",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Cricket",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Cycling",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Diving",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "eSports",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Fantasy Sports",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Fitness",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Golf",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Hockey",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Hunting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Outdoors",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Racing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Recreation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Rugby",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Sailing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Skiing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Soccer",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Sporting Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Sports",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Surfing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Swimming",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Table Tennis",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Tennis",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Ultimate Frisbee",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Volley Ball",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sports"
  },
  {
      "value": "Biofuel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Biomass Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Clean Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "CleanTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Energy Efficiency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Environmental Engineering",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Green Building",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Green Consumer Goods",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "GreenTech",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Natural Resources",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Organic",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Pollution Control",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Recycling",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Renewable Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Solar",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Sustainability",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Waste Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Water Purification",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Wind Energy",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Sustainability"
  },
  {
      "value": "Air Transportation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Automotive",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Autonomous Vehicles",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Car Sharing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Courier Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Delivery Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Electric Vehicle",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Ferry Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Fleet Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Food Delivery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Freight Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Last Mile Transportation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Limousine Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Logistics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Marine Transportation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Parking",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Ports and Harbors",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Procurement",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Public Transportation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Railroad",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Recreational Vehicles",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Ride Sharing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Same Day Delivery",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Shipping",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Shipping Broker",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Space Travel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Supply Chain Management",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Taxi Service",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Transportation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Warehousing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Water Transportation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Transportation"
  },
  {
      "value": "Adventure Travel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Amusement Park and Arcade",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Business Travel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Hospitality",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Hotel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Museums and Historical Sites",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Parks",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Resorts",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Timeshare",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Tour Operator",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Tourism",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Travel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Travel Accommodations",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Travel Agency",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Vacation Rental",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Travel and Tourism"
  },
  {
      "value": "Animation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Broadcasting",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Film",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Film Distribution",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Film Production",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Motion Capture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "TV",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "TV Production",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Video",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Video Editing",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Video on Demand",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Video Streaming",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Video"
  },
  {
      "value": "Life insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Insurance"
  },
  {
      "value": "Disability income Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Insurance"
  },
  {
      "value": "Health Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Insurance"
  },
  {
      "value": "Homeowners Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Insurance"
  },
  {
      "value": "Car Insurance",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Insurance"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Insurance"
  },
  {
      "value": "Commercial Aviation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "General Aviation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "Military Aviation",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "Unmanned Aerial Systems",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "Space Systems and Equipment",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "MRO",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "Suppliers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Aerospace and Defense (A&D)"
  },
  {
      "value": "Light vehciles",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Trucks and buses",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Construction and agriculture",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Electric cars",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Autonomous vehicles",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "OEM Manufacturers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Dealers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Tier -1 Supplier",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Tier-2 Supplier",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Automotive"
  },
  {
      "value": "Pharmaceuticals",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Biotechnology",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Medical devices",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Biomedical technologies",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Nutraceuticals",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Cosmeceuticals",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Genetics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Life science"
  },
  {
      "value": "Utilties",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Utilities"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Utilities"
  },
  {
      "value": "Retailers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Wholesalers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Distributors",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Agents",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Brokers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Internet",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Sales team",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Resellers",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Catalog",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Direct Channel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Indirect Channel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Hybrid Channel",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Logistics",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  },
  {
      "value": "Others",
      "selected": false,
      "disable": false,
      "Year": "",
      "skill": "",
      "group": "Distribution"
  }
]
  lastIndex:number=14;
  dataAtTimeOfStartHiring='';
  ngOnInit(): void {
      this.getData();
    this.dataAtTimeOfStartHiring =  this.route.snapshot.queryParams['data'];
    this.getCountry();
  }
  getData(){
    this.httpService.get('employerProfile/getEmployerProfileSteps').subscribe((response: any) => {
        if (response.status) {
          // this.rootTalentObject = response
          this.employeeQuestionData = response.employerProfile;
          console.log(this.employeeQuestionData);
          if(this.dataAtTimeOfStartHiring){
            this.lastIndex =13;
            this.employeeQuestionData.splice(-1,1);
        }
        }
      }, (error) => {
        console.log(error);
      });
  }
  getCountry(){
    this.httpService.get('location/getCountries').subscribe((response: any) => {
      if(response.status){
        this.countries = response.countries;
      }
    });
  }
  onSelectCountry(opt:any){
    this.employeeQuestionData[13].selectData.location = this.countries.find((item:any)=>item.code === opt);
    this.selectedCountry = opt;
    // this.getState(opt);
  }

  onChange(index:number){
    this.currentIndex += index;
    if(this.currentIndex === 5  && this.showTechQuestion === false){
      if(index>0){
        this.currentIndex = this.currentIndex +1;

      }
      else if (index <0){
        this.currentIndex = this.currentIndex - 1;
      }
 }
    this.width = (this.currentIndex / 15) * 100;
    if(this.currentIndex === 1){
      this.firstOption = true;
    }
    console.log(this.currentIndex);
    console.log(this.answers);
    const questionType = this.getType();
    if(this.type.select === questionType){
         //Do nothing
    }
    else if(this.type.selectBox === questionType || this.type.techquestion === questionType){
       this.fieldArray = [];
       this.checkAndShowData();
    }
    // this.enableDisableNextButton();

  }

  getType():string{
  if(this.currentIndex ===1 ||this.currentIndex ===2 ||this.currentIndex ===3){
    return 'selectBox';
  }
  else if (this.currentIndex === 5){
    return 'techquestion';
  }
  else if (this.currentIndex === 11){
    return 'multiselect';
  }
  else if (this.currentIndex === 4 ){
    return 'selectYesNo';
  }
  else if (this.currentIndex === 13){
    return 'resumequestion';
  }
  else{
    return 'select';
  }
  }

  buttonData(opt:any){
  this.buttonDataFilter = opt.value;
  }

  checkAndShowData(){
      if(this.employeeQuestionData[this.currentIndex] && this.employeeQuestionData[this.currentIndex].option){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.selected=== true ){
        this.fieldArray.push(element);
      }
    });
  }
}
  // getData(){
  //   return this.http.get('/assets/employerquestion.json').subscribe(res =>{
  //     this.employeeQuestionData = res;
  //     console.log(this.employeeQuestionData[0].type);
  //   });
  // }
  deleteSelectedOption(field:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.value.toLowerCase() === field.value.toLowerCase()){
        element.selected = false;
        element.disable = false;
        this.fieldArray = this.fieldArray.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase())
      }
});
// this.enableDisableNextButton();
  }
  selectOption(opt:any,type:string){
    if(type === 'selectBox' || type === 'techquestion'){
        opt.selected= true;
        opt.disable = true;
        if(this.currentIndex === 1){
          this.enterpriseApplicationGroup = opt.value;
        this.employeeQuestionData[this.currentIndex].option.forEach((option:any)=>{
            option.disable = true;
        });
        }
        if(this.currentIndex === 2){
          this.enterpriseApplicationSubGroup.push(opt.value);
        }
        if(this.currentIndex === 3){
            this.employeeQuestionData[this.currentIndex].option.forEach((option:any)=>{
                option.disable = true;
            });
          }
        this.getDataForFieldArray(opt);
    }
    else if (type === 'selectYesNo'){
       opt.selected = !opt.selected;
       this.showOrHideTechQuestion(opt);
       this.disableOtherValues(opt);

    }
    else if (type === 'select'){
      opt.selected = !opt.selected;
      this.disableOtherValues(opt);
      
    }
    else if (type === 'multiselect'){
      opt.selected = !opt.selected;
      // this.disableOtherValues(opt);
      
      
    }
    else if (type === 'resumequestion'){
      // opt.selected = !opt.selected;
      // this.disableOtherValues(opt);
      
    }
    // this.enableDisableNextButton();
  }
  getDataForFieldArray(opt:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.selected === true && element.value.toLowerCase() === opt.value.toLowerCase()){
        this.fieldArray.push({value:opt.value,noOfYear:'',skill:''});
      }
});
  }

  disableOtherValues(opt:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(opt.selected === true && opt.value != element.value ){
        element.disable = true;
      }
      else if(opt.selected === false){
        element.disable = false;
      }
});
  }

  showOrHideTechQuestion(opt:any){
    this.showTechQuestion = false;
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.selected === true && opt.value.toLowerCase() === 'yes'){
        this.showTechQuestion = true;
      }
});
  }
  // onInputNoOfYear(opt:any){
    
  //   // console.log(event);
  //   // this.ref.detectChanges();
  //   this.upDateYearInMixedType(opt.event,opt.field);
  //   // this.enableDisableNextButton();
  // }
  // onInputSkill(opt:any){
  //   // console.log(event);
  //   // this.ref.detectChanges();
  //   this.upDateSkillInMixedType(opt.event,opt.field);
  //   // this.enableDisableNextButton();
  // }

  // upDateYearInMixedType(value:any,completeData:any){
  //   this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
  //            if(completeData.value.toLowerCase() === element.value.toLowerCase() && element.selected === true && element.disable ===true){
  //              element.noOfYear = value;
  //             //  completeData.noOfYear = value;
  //            }
  //         });

  //  this.fieldArray.forEach((element:any)=>{
  //    if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
  //         element.noOfYear = value;
  //    }
  //  });
  // }

  // upDateSkillInMixedType(value:any,completeData:any){
  //   this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
  //            if(completeData.value.toLowerCase() === element.value.toLowerCase()  && element.selected === true && element.disable === true){
  //              element.skill = value;
  //             //  completeData.skill = value;
  //            }
  //         });

  //         this.fieldArray.forEach((element:any)=>{
  //           if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
  //                element.skill = value;
  //           }
  //         });
  // }


  enableDisableNextButton(){
    this.disableNextButton = true;
    let checkVariableForMixed = false;
    const questionType = this.getType();
    if(this.type.select === questionType){
      this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
        if(element.selected=== true && element.disable=== false){
          this.disableNextButton = false;
        }
      });
    }
    else if(this.type.selectBox === questionType){
      this.fieldArray.forEach((element:any)=>{
        if(element.value != '' && element.noOfYear != '' &&  element.skill != ''){
             checkVariableForMixed = true;
        }
        else{
          checkVariableForMixed = false;
        }
      });
      this.disableNextButton = !checkVariableForMixed;
      
    }
    else if(this.type.textarea === questionType){
      if(this.employeeQuestionData[this.currentIndex].value != '' && this.employeeQuestionData[this.currentIndex].value.length>=200 ){
        this.disableNextButton = false;
      }
    }
    else if(this.type.multiselect === questionType){
     for(var i= 0;i<this.employeeQuestionData[this.currentIndex].option.length;i++){
       if(this.employeeQuestionData[this.currentIndex].option[i].selected === true){
         this.disableNextButton = false;
       }
     }
    }
  }
  goToMyProfile(){
    // this.router.navigate(['/employer-profile']);
    console.log(this.employeeQuestionData);
  }

  saveData(){
    let employer:any = this.employeeQuestionData;
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id,
      steps:JSON.stringify(employer)
    }
    this.httpService.post('employerProfile/createEmployerProfile',data).subscribe((response: any) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.router.navigate(['/employer-profile']);
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }
}
