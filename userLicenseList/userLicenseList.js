// userLicenseList.js
import { LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartjs';
import getLicenseInfo from '@salesforce/apex/UserLicenseController.getLicenseInfo';

export default class UserLicenseList extends LightningElement {
    chart;
    chartjsInitialized = false;

    @wire(getLicenseInfo)
    wiredData({ error, data }) {
        if (data) {
            this.createChart(data);
        } else if (error) {
            console.error('Error loading license data', error);
        }
    }

    renderedCallback() {
        if (this.chartjsInitialized || this.chart) {
            return;
        }

        // Load Chart.js library
        loadScript(this, chartjs + '/Chart.min.js')
            .then(() => {
                // Chart.js is loaded, continue to create the chart
                this.chartjsInitialized = true;
                if (this.wiredData.data) {
                    this.createChart(this.wiredData.data);
                }
            })
            .catch(error => {
                console.error('Error loading Chart.js', error);
            });
    }

    createChart(data) {
        const ctx = this.template.querySelector('canvas').getContext('2d');

        const labels = data.map(record => record.Name);
        const totalLicenses = data.map(record => record.TotalLicenses);
        const usedLicenses = data.map(record => record.UsedLicenses);
        const remainingLicenses = data.map(record => record.RemainingLicenses);

        this.chart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Licenses',
                        data: totalLicenses,
                        backgroundColor: 'blue',
                    },
                    {
                        label: 'Used Licenses',
                        data: usedLicenses,
                        backgroundColor: 'green',
                    },
                    {
                        label: 'Remaining Licenses',
                        data: remainingLicenses,
                        backgroundColor: 'orange',
                    },
                ],
            },
            options: {
                scales: {
                    x: [{ stacked: true }],
                    y: [{ stacked: true }],
                },
            },
        });
    }
}
