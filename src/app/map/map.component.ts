import { Component, OnInit } from '@angular/core';
import { MapDataService } from 'src/app/map-data.service';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import {Fill, Stroke, Style, Text} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';
import Select from 'ol/interaction/Select';

declare var jQuery: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	
	state: any;
	district: any;
	block: any; 
	map: Map;
	vectorLayer2: any;
	vectorLayer3: any;
	StateStyle :any; 
	districtStyle :any;
	BlockStyle :any;
  constructor(private mapdataService: MapDataService) { }

  ngOnInit(): void {
  	this.retrieveData();
  	//Jquery
  	(function ($) {
      $(".accordion").click(function() {
      	if (this.className == 'accordion active_a') {
	    		if ($(this).val() == 'region_based') {
	      			$('#region_based_div').hide();
	    		} 
	    	}else{
	    		if ($(this).val() == 'region_based') {
	      			$('#region_based_div').show();
	    		} 
	    	}
    		this.classList.toggle("active_a");
      });
    })(jQuery);
     this.StateStyle = new Style({
					  	fill: new Fill({
					    	color: 'rgba(255, 255, 255, 0.6)',
					  	}),
					  	stroke: new Stroke({
					    	color: '#319FD3',
					    	width: 1,
					  	}),
				});
	this.districtStyle = new Style({
						  	fill: new Fill({
						    	color: 'rgba(255, 255, 255, 0.6)',
						  	}),
						  	stroke: new Stroke({
						    	color: '#d95f0e',
						    	width: 1,
						  	}),
						});
	this.BlockStyle = new Style({
						  	fill: new Fill({
						    	color: 'rgba(255, 255, 255, 0.6)',
						  	}),
						  	stroke: new Stroke({
						    	color: '#fc9272',
						    	width: 1,
						  	}),
						});
  }

  retrieveData(): void {
    this.mapdataService.getAll()
      .subscribe(
        data => {
          this.state = data;
          console.log(data);
        },
        error => {
          console.log(error);
        },
        () =>{
        	(function ($) {
        		$('.ajax-loader').hide();
        	})(jQuery);
        	this.mapData();
        	this.mapdataService.getDistrict()
		      	.subscribe(
			        data => {
			          this.district = data;
			          console.log(data);
			        },
			        error => {
			          console.log(error);
			        },
			        () =>{
			        	this.mapDistrictData();
			        	this.mapdataService.getBlock()
					      	.subscribe(
						        data => {
						          this.block = data;
						          console.log(data);
						        },
						        error => {
						          console.log(error);
						        },
						        () =>{
						        	this.mapBlockData();
						        }
					        );
			        }
		        );
        }
        );
  }

  districtData(): void {
  	(function ($) {
       	$('.ajax-loader').show();
    })(jQuery);
  	this.mapdataService.getDistrict()
      	.subscribe(
	        data => {
	          this.district = data;
	          console.log(data);
	        },
	        error => {
	          console.log(error);
	        },
	        () =>{
	        	(function ($) {
        			$('.ajax-loader').hide();
        		})(jQuery);
	        	this.mapDistrictData();
	        }
        );
  }
  blockData(): void {
  	(function ($) {
        $('.ajax-loader').show();
    })(jQuery);
  	this.mapdataService.getBlock()
      	.subscribe(
	        data => {
	          this.block = data;
	          console.log(data);
	        },
	        error => {
	          console.log(error);
	        },
	        () =>{
	        	(function ($) {
        			$('.ajax-loader').hide();
        		})(jQuery);
	        	this.mapBlockData();
	        }
        );
  }

  	mapData(): void{
	  	var geojsonFeature = this.state.tn_state;
	    //Map
	    var vectorSource = new VectorSource({
	  		features: (new GeoJSON()).readFeatures(geojsonFeature, {featureProjection: 'EPSG:3857'})
		});
		var vectorLayer = new VectorLayer({
				title:"Tamil nadu Map",
				visible: true,
	            baseLayer: true,
	  			source: vectorSource,
	  			style: this.StateStyle
		});
		// Map Define
		 this.map = new Map({
		    target: 'map',
		    layers: [
		           	vectorLayer
		    ],
		    view: new View({
		        center:[8781480.570496075, 1224732.6162325153],
		        zoom:7
		    })
	    });	
	    var selectPointerMove = new Select({
  			condition: click,
		});
		this.map.addInteraction(selectPointerMove);
  	}
  	mapDistrictData(): void {
  		var geojsonDistrictFeature = this.district.tn_district;
  		//console.log(geojsonDistrictFeature);
	    //Map
	    var vectorDistrictSource = new VectorSource({
	  		features: (new GeoJSON()).readFeatures(geojsonDistrictFeature, {featureProjection: 'EPSG:3857'})
		});
		 this.vectorLayer2 = new VectorLayer({
			title:"Tamil nadu District Map",
			visible: false,
            baseLayer: false,
  			source: vectorDistrictSource,
  			style:this.districtStyle
		});
		this.map.addLayer(this.vectorLayer2);
  	}
  	mapBlockData(): void {
  		var geojsonBlockFeature = this.block.tn_blocks;
  		//console.log(geojsonBlockFeature);
	    //Map
	    var vectorBlockSource = new VectorSource({
	  		features: (new GeoJSON()).readFeatures(geojsonBlockFeature, {featureProjection: 'EPSG:3857'})
		});
		 this.vectorLayer3 = new VectorLayer({
			title:"Tamil nadu District block Map",
			visible: false,
            baseLayer: false,
  			source: vectorBlockSource,
  			style:this.BlockStyle
		});
		this.map.addLayer(this.vectorLayer3);
  	}
  	onCheckboxChange(e) {
	    if(e.target.value == 'district'){
	    	if(e.target.checked){
	    		//this.districtData();
	    		this.vectorLayer2.setVisible(true);
	    	}else{
	    		//this.map.removeLayer(this.vectorLayer2);
	    		this.vectorLayer2.setVisible(false);
	    	}
	    }else if(e.target.value == 'block'){
	    	if(e.target.checked){
	    		//this.blockData();
	    		this.vectorLayer3.setVisible(true);
	    	}else{
	    		//this.map.removeLayer(this.vectorLayer3);
	    		this.vectorLayer3.setVisible(false);
	    	}
	    }
  	}

}
