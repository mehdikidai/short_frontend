import moment from 'moment';

export const gridChart = {
	x: {
		grid: {
			display: true,
			color: 'rgba(255, 255, 255, 0)',
		},
		ticks: {
			beginAtZero: true,
			font: {
				size: 12,
			},
			color: '#777',
		},
		border: {
			color: '#0000',
		},
	},
	y: {
		grid: {
			display: true,
			color: 'rgba(255, 255, 255, 0.05)',

			border: {
				dash: [5, 5],
			},
			drawTicks: false,
		},
		ticks: {
			beginAtZero: true,
			padding: 10,
			stepSize:1,
			font: {
				size: 12,
			},
			color: '#777',
		},
		border: {
			color: '#0000',
		},
		beginAtZero: true,
	},
};

export const chartVisitsConfig = (DATA) => {
	return {
		type: 'line',
		data: {
			labels: DATA.map((row) => row.id),
			datasets: [
				{
					label: 'Number of visits by id',
					data: DATA.map((row) => row.visits),
					backgroundColor: '#2a9d8f',
					borderColor: '#2a9d8f',
					tension: 0.3,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: false,
				},
				legend: {
					display: false,
				},
			},
			scales: gridChart,
			//responsive: true,
			//maintainAspectRatio: false,
		},
	};
};

export const chartTwoConfig = (DATA) => {
	return {
		type: 'bar',
		data: {
			labels: Object.keys(DATA).map((el) => moment(el).format("MM-DD")),
			datasets: [
				{
					label: 'Visits',
					data: Object.values(DATA),
					backgroundColor: ['#e76f51', '#2a9d8f'],
					borderColor: '#36A2EB',
					barPercentage: 0.1,
					borderRadius: 0,
					borderSkipped: false,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: false,
				},
				legend: {
					display: false,
				},
			},
			scales: gridChart,
			//responsive: true,
			//maintainAspectRatio: false,
		},
	};
};
