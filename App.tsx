import React, { useRef, useLayoutEffect } from 'react';
import './style.css';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins from '@amcharts/amcharts4/plugins/sunburst';
import data from './data.json';

am4core.useTheme(am4themes_animated);

function App(props) {
  const chart = useRef(null);

  useLayoutEffect(() => {
    let chart = am4core.create('chartdiv', am4plugins.Sunburst);

    chart.fontSize = 11;
    chart.innerRadius = am4core.percent(0);
    chart.radius = am4core.percent(100);

    // Make colors more distinctive
    chart.colors.step = 3;

    // Add multi-level data
    chart.dataSource.data = data;
    console.log(chart.dataSource.data);

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

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ fontFamily: 'Figtree' }}></div>;
}
export default App;
