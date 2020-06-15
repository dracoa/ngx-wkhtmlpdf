import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WkhtmltopdfService} from './wkhtmltopdf.service';


const footer = `<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <script>
    function substitutePdfVariables() {
      function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\\\\+/g, ' '));
      }

      function substitute(name) {
        var value = getParameterByName(name);
        var elements = document.getElementsByClassName(name);
        for (var i = 0; elements && i < elements.length; i++) {
          elements[i].textContent = value;
        }
      }

      ['frompage', 'topage', 'page', 'webpage', 'section', 'subsection', 'subsubsection'].forEach(function (param) {
        substitute(param);
      });
    }
  </script>
</head>

<body onload="substitutePdfVariables()">
<p>&nbsp;</p>
<p style="text-align: right; font-family: 'Calibri', sans-serif;">Page <span class="page"></span> of <span class="topage"></span>
</p>
</body>

</html>`;
const options = {'margin-top': '10', 'margin-bottom': '20'};
const style = `

.preview-area {
  display: flex;
  justify-content: center;
}

#main-page {
  width: 882px;
  font-size: 15px;
  font-family: 'Calibri', sans-serif;
}

.page-section {
  margin-bottom: 20px;
  page-break-inside: avoid !important;
}

.assessment {
  margin-bottom: 50px;
}

.core-dimensions{
  margin-bottom: 30px;
}

.overall-assessment{
  padding:20px;
  border: 1px solid black;
}

.prevent-page-break {
  page-break-inside: avoid !important;
}

table {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding-left: 5px;
  vertical-align: top;
  text-align: left;
  height: 25px;
}

thead {
  display: table-row-group;
}

th {
  background-color: #f6f6f6;
}

tr {
  page-break-before: always;
  page-break-after: always;
  page-break-inside: avoid;
}

.ellipse {
  width: 382px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-number {
  width: 100px;
  text-align: right;
  padding-right: 5px;
}

table.fixed-layout {
  table-layout: fixed;
}

.no_border, .no_border th, .no_border td {
  border: none;
}

h2 {
  margin-top:50px;
}

.bottom-border {
  border-bottom: 1px solid black !important;
}
`;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  blobUrl;
  @ViewChild('mainPage', {static: true})
  mainPage: ElementRef;

  pdfView = false;

  constructor(private wk: WkhtmltopdfService) {
  }

  ngOnInit() {
    this.renderPDF();
  }

  renderPDF() {
    this.wk.loadWithStyles(
      this.mainPage.nativeElement.innerHTML, '', footer, style, options
    ).subscribe(url => this.blobUrl = url);
  }
}
