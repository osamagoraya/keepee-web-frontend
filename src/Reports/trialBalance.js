let writeTextToDataURL = function(text, color='black', top=1, bottom=13, size = "1px Roboto, sans-serif", height = 3, width = 100)
  {
    var x = document.createElement("CANVAS");
    var context = x.getContext("2d");
  
    x.height = height;
    x.width = width;
  
  
    context.fillStyle = color;
    context.font = "bold 12px Heebo";
    context.textBaseline = "top";
    context.beginPath();
    context.fillText(text, top, bottom,700);
    context.scale(2, 2)
    context.closePath();
    context.fill();
  
  
    return x.toDataURL();
  }

export const tbDD = (data,businessName,reportYear,UserNID) => ({
	// background color of whole document
    background: function () {
        return {
	        canvas: [
				{
					type: 'rect',
					x: 0, y: 0, w: 595.28, h: 841.89,
					color: '#F8F8F8'
				}
			]
	    };
    },
	content: [
        {
			image: writeTextToDataURL(businessName + " - " + UserNID,'black', 1, 1, "15px Heebo", 20,220), 
			margin: [5,0],
			alignment:"left"
		},
		{
			image: writeTextToDataURL(reportYear + ' מאזן בוחן שנת','black', 1, 1, "15px Heebo", 20,220), 
			margin: [-35,-10], 
			alignment:"right"
		},
		{
            style: 'tableExample',
            unbreakable: true,
			table: {
			    widths: ['*'],
				body: [
					[
						{
							text: {},
							fillColor: '#F8F8F8',
							border: [false, false, false, true],
							margin: [15,0]
						}
					]
				]
			},
			layout: {
				hLineColor: '#828389'
			}
		}, // Line
		{
			style: 'tableExample',
			table: {
			    widths: ['*','*','*','*'],
				heights: [30],
				margin: [0,0,0,0],
                unbreakable: true,
				body: [
					[
						{
							image:  writeTextToDataURL("יתרה",'black', 55, 10, "15px Heebo", 20),
							fillColor: '#dbdada;',
							margin:[-20,0],
							border: [false, false, false, false]
						},
						{
							image:  writeTextToDataURL("חובה",'black', 75, 10, "15px Heebo", 20,120),
							fillColor: '#dbdada;',
							margin: [-90,0],
							border: [false, false, false, false]
						},
						{
							image:  writeTextToDataURL("זכות",'black', 65, 10, "15px Heebo", 20),
							fillColor: '#dbdada;',
							margin:[-100,0],
							border: [false, false, false, false]
						},
						{
							image:  writeTextToDataURL("חשבון",'black', 5, 10, "15px Heebo", 20),
							fillColor: '#dbdada;',
							border: [false, false, false, false]
						}
					]
				]
			}
		}, // Grey header
		data
	],
	styles: {
		header: {
			fontSize: 15,
			bold: true,
			margin: [0, 0, 0, 5]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 0]
		},
		input: {
			margin: [0, 15, 0, 15]
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		}
	},
	defaultStyle: {
	}
	
}
);