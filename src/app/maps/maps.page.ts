import { Component, OnInit, inject } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as L from 'leaflet';
import { DataService } from '../data.service';

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
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage implements OnInit {
  map!: L.Map;

  private dataService = inject(DataService);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  constructor() {}

  async loadPoints() {
    const points: any = await this.dataService.getPoints();
    for (const key in points) {
      if (points.hasOwnProperty(key)) {
        const point = points[key];
        const coordinates = point.coordinates
          .split(',')
          .map((c: string) => parseFloat(c));
        const marker = L.marker(coordinates as L.LatLngExpression).addTo(
          this.map
        );
        marker.bindPopup(`
          <div class="custom-popup">
            <div class="popup-header">${point.name}</div>
            <div class="popup-actions">
              <a href="/editpoint/${key}" class="popup-button edit">
                <ion-icon name="create-outline"></ion-icon> Edit
              </a>
              <a href="#" class="popup-button delete delete-link" data-key="${key}">
                <ion-icon name="trash-outline"></ion-icon> Delete
              </a>
            </div>
          </div>
        `);
      }
    }

    this.map.on('popupopen', (e) => {
      const popup = e.popup;
      const deleteLink = popup.getElement()?.querySelector('.delete-link');
      if (deleteLink) {
        deleteLink.addEventListener('click', (event) => {
          event.preventDefault();
          const key = (event.currentTarget as HTMLElement).dataset['key'];
          if (key) {
            this.deletePoint(key, popup.getLatLng());
          }
        });
      }
    });
  }

  async deletePoint(key: string, latLng: L.LatLng | undefined) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this point?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing
          },
        },
        {
          text: 'Delete',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Deleting...',
              spinner: 'crescent',
              showBackdrop: true
            });
            await loading.present();

            await this.dataService.deletePoint(key);

            if (latLng) {
              this.map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                  if (layer.getLatLng().equals(latLng)) {
                    this.map.removeLayer(layer);
                  }
                }
              });
            }

            await loading.dismiss();
            const toast = await this.toastCtrl.create({
              message: 'Point deleted successfully!',
              duration: 800,
              color: 'success'
            });
            await toast.present();
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnInit() {
    if (!this.map) {
      setTimeout(() => {
        this.map = L.map('map').setView([-7.7956, 110.3695], 13);

        var osm = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '&copy; OpenStreetMap contributors',
          }
        );

        osm.addTo(this.map)
      });
      // load points from Firebase
      this.loadPoints();
    }
  }

}
