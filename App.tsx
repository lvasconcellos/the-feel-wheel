import React, { useRef, useLayoutEffect } from 'react';
import './style.css';
import pSBC from 'shade-blend-color';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_sunburst from '@amcharts/amcharts4/plugins/sunburst';
import data from './data.json';

am4core.useTheme(am4themes_animated);

function App(props) {
  const chart = useRef(null);

  useLayoutEffect(() => {
    // Create the chart
    let chart = am4core.create('chartdiv', am4plugins_sunburst.Sunburst);
    chart.fontSize = 11;

    // Add multi-level data
    chart.data = data;

    // Define data fields
    chart.dataFields.value = 'value';
    chart.dataFields.name = 'name';
    chart.dataFields.children = 'children';
    chart.dataFields.color = 'color';

    // Configure levels
    var level0 = chart.seriesTemplates.create('0');
    level0.labels.template.text = '{category}';
    level0.labels.template.fill = am4core.color('#000');

    var level1 = chart.seriesTemplates.create('1');
    level1.slices.template.fillOpacity = 0.5;
    level1.labels.template.text = '{category}';
    level1.labels.template.fill = am4core.color('#000');

    var level2 = chart.seriesTemplates.create('2');
    level2.slices.template.fillOpacity = 0.75;
    level2.labels.template.text = '{category}';
    level2.labels.template.fill = am4core.color('#000');

    level0.slices.template.tooltipText = 'I feel {category}';
    level1.slices.template.tooltipText = 'I feel {category}';
    level2.slices.template.tooltipText = 'I feel {category}';

    level0.tooltip.fontSize = 24;
    level1.tooltip.fontSize = 24;
    level2.tooltip.fontSize = 24;

    // Add slice click event
    level0.slices.template.events.on('hit', onTemplateHit);
    level1.slices.template.events.on('hit', onTemplateHit);
    level2.slices.template.events.on('hit', onTemplateHit);

    function onTemplateHit(ev) {
      var currentSlice = ev.target;
      let topDataContext;
      switch (currentSlice._dataItem._dataContext.level) {
        case 3:
          topDataContext =
            currentSlice._dataItem._dataContext.parent.parent._dataContext;
          break;
        case 2:
          topDataContext =
            currentSlice._dataItem._dataContext.parent._dataContext;
          break;
        case 1:
          topDataContext = currentSlice._dataItem._dataContext.dataContext;
          break;
        default:
        // code block
      }

      const dataContext = currentSlice._dataItem._dataContext.dataContext;
      const bgColor = currentSlice.fill.rgba;
      const bgLightColor = pSBC(0.4, bgColor, 'c');
      var feeling = dataContext.name;
      var icon = topDataContext.icon;

      Swal.fire({
        html: `<article id="feel-card" style="background-color: ${bgColor}; font-family: "Caveat", cursive;"> <div class="article-wrapper"> <div class="article-body text-center px-0"> <span style="background-color: ${bgLightColor};" class="material-symbols-outlined p-1 circle-icon">${icon}</span> <h3 class="text-uppercase my-1">${feeling}</h3> <p class="card-title" style="background-color: ${bgLightColor};">I feel that way because:</p> <div class="form-outline my-3"> <textarea class="form-control" id="textAreaFeeling" rows="6"></textarea> <label class="form-label  text-dark" for="textAreaFeeling">Say how you feel...</label> </div> </div> </div> </article>`,
        showCloseButton: true,
        confirmButtonText: 'Do you want to save it?',
        showLoaderOnConfirm: true,
        focusConfirm: false,
        preConfirm: () => {
          const feeling = Swal.getPopup().querySelector('#textAreaFeeling');
          if (!feeling) {
            Swal.showValidationMessage(`Say how you feel`);
          } else {
            html2canvas(document.getElementById('feel-card'), {
              allowTaint: false,
              useCORS: true,
            }).then((canvas) => {
              var anchor = document.createElement('a'); //Create <a>
              anchor.href = canvas.toDataURL();
              anchor.download = `How I feel ${new Date().toJSON()}.png`;
              anchor.click();
            });
          }
        },
        allowOutsideClick: false,
      }).then((result) => {
        Swal.showLoading();
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success');
        }
      });
    }

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div className="App">
      <div
        id="chartdiv"
        style={{ height: '90vh', width: '100%', fontFamily: 'calibri' }}
      ></div>
    </div>
  );
}
export default App;
