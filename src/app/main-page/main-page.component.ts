import {Component, OnInit} from '@angular/core';
import {HttpService} from "../http.service";
import {Router} from "@angular/router";

const svgDotRadius: number = 2.5

export class Dot {
  x: number
  y: number
  r: number

  constructor(x: number, y: number, r: number) {
    this.x = x
    this.y = y
    this.r = r
  }
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  providers: [HttpService]
})
export class MainPageComponent implements OnInit {

  constructor(private httpService: HttpService, private router: Router) {
  }

  rows: Array<{ x: number, y: number, r: number, date: string, result: boolean }> = []
  //   "x": 3,
  //   "y": 3,
  //   "r": 3,
  //   "date": "fuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuckfuck",
  //   "result": true
  // },
  //   {
  //     "x": 3,
  //     "y": 3,
  //     "r": 3,
  //     "date": "время норм чела",
  //     "result": true
  //   }];

  ngOnInit(): void {
    let userToken: string | null = localStorage.getItem('userToken')
    if (userToken != null) {
      this.httpService.dataRequest(userToken).subscribe(
        (data: any) => {
          this.rows = data.map((obj: any) => {
            obj.result = obj.result == '1';
            return obj;
          });
        }
      )
    }
    else {
      this.router.navigate(["/unauthorized"])
    }
  }

  xVal: number | undefined
  yVal: number | undefined
  rVal: number | undefined

  validInput: boolean = true
  alertMsg: string = ""

  svgTrianglePoints: string = "130,130 130,30 30,130"
  svgRectanglePoints: string = "130,130 130,80 230,80 230,130"
  svgSectorD: string = "M 30 130 A 100 100 0 0 0 130 230 L 130 130 Z"

  rButtonClick(value: number) {
    this.rVal = value

    let svgGraph = document.getElementById('svg-graph')!
    let svgTrianglePolygon = svgGraph.getElementsByClassName('svg-triangle-polygon').item(0)!
    let svgRectanglePolygon = svgGraph.getElementsByClassName('svg-rectangle-polygon').item(0)!
    let svgSectorPolygon = svgGraph.getElementsByClassName('svg-sector-polygon').item(0)!
    svgTrianglePolygon.setAttribute('points', this.svgTrianglePoints)
    svgRectanglePolygon.setAttribute('points', this.svgRectanglePoints)
    svgSectorPolygon.setAttribute('d', this.svgSectorD)

    let svgDots = svgGraph.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'circle')
    let svgCnt = svgDots.length
    for (let i = 0; i < svgCnt; ++i) {
      svgDots.item(0)!.remove();
    }

    if (this.rVal == 0)
      return
    for (let dot of this.rows) {
      let svgX = dot.x / this.rVal * 100 + 130
      let svgY = 130 - dot.y / this.rVal * 100
      MainPageComponent.drawPoint(svgX, svgY, dot.result, svgDotRadius)
    }
  }

  submit() {
    console.log(this.xVal, this.yVal, this.xVal);
    this.dropAlert()

    if (this.xVal == undefined || this.yVal == undefined || this.rVal == undefined) {
      this.setAlert("Some values are not set")
      return
    }
    if (isNaN(this.yVal)) {
      this.setAlert("Y value is not a number")
      return
    }
    if (this.yVal <= -3 || this.yVal >= 3) {
      this.setAlert("Y value must be in (-3, 3)")
      return
    }
    if (this.rVal < 0) {
      this.setAlert("Radius value should not be negative")
    }
    let userToken: string | null = localStorage.getItem('userToken')
    if (userToken) {
      this.httpService.addRequest(new Dot(Number(this.xVal), Number(this.yVal), Number(this.rVal)), userToken)
        .subscribe((data: any) => {
          this.rows.push(
            {
              x: data.x,
              y: data.y,
              r: data.r,
              result: data.result == '1',
              date: data.date
            }
          )
          if (this.rVal != 0) {
            let svgX = data.x / this.rVal! * 100 + 130
            let svgY = 130 - data.y / this.rVal! * 100
            MainPageComponent.drawPoint(svgX, svgY, data.result, svgDotRadius)
          }
        })
    }
  }

  clear() {
    this.dropAlert()

    let userToken: string | null = localStorage.getItem('userToken')
    if (userToken) {
      this.httpService.clearRequest(userToken).subscribe(() => location.reload())
    }
  }

  svgGraphClick(event: any) {
    this.dropAlert();
    if (this.rVal == undefined) {
      this.setAlert("Radius isn't set")
      return;
    }
    let offset = document.getElementById("svg-graph")!.getBoundingClientRect()
    let x: number = event.clientX - offset.left
    let y: number = event.clientY - offset.top

    let x_relative: number = (x - 130) / 100 * this.rVal
    let y_relative: number = (130 - y) / 100 * this.rVal

    let precision = 5
    x_relative = MainPageComponent.round(x_relative, precision)
    y_relative = MainPageComponent.round(y_relative, precision)

    let userToken: string | null = localStorage.getItem('userToken')
    if (userToken) {
      this.httpService.addRequest(new Dot(x_relative, y_relative, this.rVal), userToken)
        .subscribe((data: any) => {
          this.rows.push(
            {
              x: data.x,
              y: data.y,
              r: data.r,
              date: data.date,
              result: data.result == '1'
            }
          )
          MainPageComponent.drawPoint(x, y, data.result, svgDotRadius);
        })
    }
  }

  private static drawPoint(x: number, y: number, hit: boolean, radius: number) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    element.setAttribute('class', "svg-point")
    element.setAttribute('cx', x.toString())
    element.setAttribute('cy', y.toString())
    element.setAttribute('r', radius.toString())
    if (hit) {
      let successColor = '#212529'
      element.setAttribute('fill', successColor)
    } else {
      let failureColor = '#ff2e2e'
      element.setAttribute('fill', failureColor)
    }
    document.getElementById("svg-graph")!.appendChild(element)
  }

  private setAlert(msg: string) {
    this.alertMsg = msg;
    this.validInput = false;
  }

  private dropAlert() {
    this.alertMsg = "";
    this.validInput = true;
  }

  private static round(n: number, precision: number): number {
    return Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision)
  }
}
