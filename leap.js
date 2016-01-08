var Cylon = require('cylon'),
    Slack = require('node-slack'),
    slack = new Slack('https://hooks.slack.com/services/****');

Cylon.robot({
    connections: {
        'leapmotion': { adaptor: 'leapmotion' },
		//非常時用のキーボードコネクション
		'keyboard': { adaptor: 'keyboard' }
    },
    devices: {
        leapmotion: { driver: 'leapmotion', connection: 'leapmotion'},
		keyboard: {driver: 'keyboard', connection: 'keyboard'}
    },

    work: function (my) {
		console.log("Initialize has finished.");
		my.leapmotion.on('hand', function(payload) {
			// my.log(payload.toString());	
		});
		my.leapmotion.on('gesture', function(g) {
			if (g.type == "circle") {
				my.log(g.type);
			} else if (g.type == "swipe") {
				var isHorizontal = Math.abs(g.direction[0]) > Math.abs(g.direction[1]);
				if(isHorizontal){
					if(g.direction[0] > 0){
						swipeDirection = "right";
					} else {
						swipeDirection = "left";
					}
				} else { //vertical
					if(g.direction[1] > 0){
						console.log("hoo!");
						swipeDirection = "up";
					} else {
						swipeDirection = "down";
					}                  
				}
				console.log(swipeDirection)

			}
		});
    }
}).start();
