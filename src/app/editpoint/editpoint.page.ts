import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../data.service';
import * as L from 'leaflet';


const iconRetinaUrl = 'assets/icon/marker-icon-2x.png';
const iconUrl = 'assets/icon/marker-icon.png';
const shadowUrl = 'assets/icon/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-editpoint',
  templateUrl: './editpoint.page.html',
  styleUrls: ['./editpoint.page.scss'],
  standalone: false,
})
export class EditpointPage implements OnInit {
  map!: L.Map;
  key = '';
  name = '';
  coordinates = '';


  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private dataService = inject(DataService);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  constructor() { }

  async ngOnInit() {
    this.key = this.route.snapshot.paramMap.get('key') || '';


    const point: any = await this.dataService.getPoint(this.key);
    this.name = point.name;
    this.coordinates = point.coordinates;


    // Load map
    this.map = L.map('mapedit').setView(point.coordinates.split(','), 13);


    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    // Esri World Imagery
    var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'ESRI'
    });


    osm.addTo(this.map);


    // Layer control
    var baseMaps = {
      "OpenStreetMap": osm,
      "Esri World Imagery": esri
    };


    L.control.layers(baseMaps).addTo(this.map);


    var tooltip = '<div class="custom-popup">Drag marker to change location</div>';
    var marker = L.marker(point.coordinates.split(','), { draggable: true });
    marker.addTo(this.map);
    marker.bindPopup(tooltip, { closeButton: false });
    marker.openPopup();


    //Dragend marker
    marker.on('dragend', (e) => {
      let latlng = e.target.getLatLng();
      let lat = latlng.lat.toFixed(9);
      let lng = latlng.lng.toFixed(9);


      // push lat lng to coordinates input
      this.coordinates = lat + ',' + lng;
    });
  }

  async save() {
    if (this.name && this.coordinates) {
      const loading = await this.loadingCtrl.create({
        message: 'Saving...',
        spinner: 'crescent',
        showBackdrop: true
      });
      await loading.present();

      try {
        await this.dataService.updatePoint(this.key, { name: this.name, coordinates: this.coordinates });
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Point updated successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.navCtrl.back();
      } catch (error: any) {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Save Failed',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

}
