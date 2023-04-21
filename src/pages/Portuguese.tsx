import React, { useRef, useLayoutEffect } from 'react';
import pSBC from 'shade-blend-color';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_sunburst from '@amcharts/amcharts4/plugins/sunburst';
import data from '../data/br.json';
import us from '../assets/img/us.svg';

am4core.useTheme(am4themes_animated);

function Portuguese(props) {
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

    level0.slices.template.tooltipText = 'Me sinto {category}';
    level1.slices.template.tooltipText = 'Me sinto {category}';
    level2.slices.template.tooltipText = 'Me sinto {category}';

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
            style="background-color: ${bgColor};"
          >
            <div class="d-flex flex-column bd-highlight justify-content-center flex-wrap">
              <div class=" bd-highlight">
                <span
                  style="background-color: ${bgLightColor};"
                  class="material-symbols-outlined p-1 m-1 circle-icon">
                    ${icon}
                </span>
              </div>
              <div class="bd-highlight">
                  <h2>
                    Estou me sentindo <span class="text-uppercase">${feeling}</span>
                  </h2>
              </div>
              <div class="bd-highlight">
                  <h4 class="card-title" style="background-color: ${bgLightColor};">
                    E me sinto assim, porque:
                  </h4>
              </div>
              </div>
              <div class="bd-highlight">
                <textarea
                  style="border:0; background-color: ${bgColor};"
                  class="form-control w-80"
                  id="textAreaFeeling"
                  rows="6"
                  placeholder="Diga como se sente..."></textarea>
              </div>
              </div>
            </div>
            </div>
          </article>`,
        background: bgLightColor,
        confirmButtonText: 'Quero guardar isso',
        cancelButtonText: 'Prefero esquecer',
        showCancelButton: true,
        showCloseButton: false,
        focusConfirm: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: () => {
          Swal.showLoading();
          return new Promise((resolve) => {
            if (
              document.getElementById('textAreaFeeling').value.trim().length ==
              0
            ) {
              Swal.showValidationMessage(`Por favor, diga como se sente`);
              Swal.hideLoading();
              return;
            }
            setTimeout(() => {
              html2canvas(document.getElementById('feel-card'), {
                allowTaint: false,
                useCORS: true,
              }).then((canvas) => {
                var anchor = document.createElement('a'); //Create <a>
                anchor.href = canvas.toDataURL();
                anchor.download = `Como se sente ${new Date().toJSON()}.png`;
                anchor.click();
              });
              resolve(true);
            }, 3000);
          });
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Seus sentimentos estão guardados',
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
      <div className="fixed-top">
        <div className="d-flex flex-row bd-highlight mb-3">
          <div className="p-2 bd-highlight">
            <a href="/" class="link-success">
              <img
                src={us}
                width="30px"
                className="rounded mx-auto d-block"
                alt="Português"
              />
            </a>
          </div>
        </div>
      </div>
      <h1 className="text-center fw-bolder"> Como está se sentindo? </h1>
      <div id="chartdiv"></div>
    </div>
  );
}
export default Portuguese;
