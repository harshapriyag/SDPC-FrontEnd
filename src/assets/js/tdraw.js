var measurementRadios = $('#type');
//var resultElement = $('#js-result');
var measuringTool;

var enableMeasuringTool = function() {
  map.removeInteraction(measuringTool);

  var geometryType = $('#type').val();
  var html = geometryType === 'Polygon' ? '<sup>2</sup>' : '';

  measuringTool = new ol.interaction.Draw({
    type: geometryType,
    source: vectorLayer.getSource()
  });

  measuringTool.on('drawstart', function(event) {
    vectorLayer.getSource().clear();

    event.feature.on('change', function(event) {
		if (geometryType == 'Polygon') {
			var area = event.target.getGeometry().getArea();
			  if (area > 10000) {
				output = (Math.round(area / 1000000 * 100) / 100) +
					' ' + 'km';
			  } else {
				output = (Math.round(area * 100) / 100) +
					' ' + 'm';
			  }
			
		}
		
		else {
			var length = event.target.getGeometry().getLength();
			
				if (length > 100) {
					output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
				} else {
					output = (Math.round(length * 100) / 100) + ' ' + 'm';
				}
		}
      
      $('#js-result').html(output + html);
    });
  });

  map.addInteraction(measuringTool);
};

//measurementRadios.on('change', enableMeasuringTool);


