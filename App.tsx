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
    //chart.fontSize = '0.7rem';

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

    level0.tooltip.fontSize = '1.7rem';
    level1.tooltip.fontSize = '1.7rem';
    level2.tooltip.fontSize = '1.7rem';

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
        html: `<article
        id="feel-card"
        style="background-color: ${bgColor}; font-family: 'Caveat', cursive;"
      >
        <div class="article-wrapper">
          <div class="article-body text-center p-0">
            <span
              style="background-color: ${bgLightColor};"
              class="material-symbols-outlined p-1 circle-icon"
            >${icon}
            </span>
            <h3 class="my-1">
              I am <span class="text-uppercase">${feeling}</span>
            </h3>
            <p class="card-title" style="background-color: ${bgLightColor};">
              And I feel this way because:
            </p>
            <div style="position: relative; width: 100%;">
              <textarea
                style="border:0; background-color: ${bgColor};"
                class="form-control w-100"
                id="textAreaFeeling"
                rows="6"
                placeholder="Say how you feel..."
              ></textarea>
            </div>
          </div>
        </div>
      </article>`,
        background: bgLightColor,
        confirmButtonText: 'Save it',
        cancelButtonText: 'Let it go',
        showCancelButton: true,
        showCloseButton: false,
        focusConfirm: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: async () => {
          const feeling = document.getElementById('textAreaFeeling').innerText;
          if (!feeling) {
            Swal.showValidationMessage(`Please, say how you feel`);
          } else {
            await html2canvas(document.getElementById('feel-card'), {
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
      }).then((result) => {
        Swal.showLoading();
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Your feelings have been saved',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div className="App">
      <h1 className="text-center fw-bolder"> How are you feeling? </h1>
      <div id="chartdiv"></div>
    </div>
  );
}
export default App;
