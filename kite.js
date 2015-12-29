var Cylon = require('cylon'),
    Slack = require('node-slack'),
    slack = new Slack('https://hooks.slack.com/services/****');

Cylon.robot({
    connections: {
        'leapmotion' : { adaptor: 'leapmotion'},
        'rolling-spider': { adaptor: 'rolling-spider' }
    },
    devices: {
        leapmotion: { driver: 'leapmotion', connection: 'leapmotion'},
        drone: { driver: 'rolling-spider' }
    },

    work: function (my) {

        my.leapmotion.on('frame', function(frame){
            if(frame.hands.length > 0){
                slack.send({
                    text: ':computer:: ' + my.drone.name,
                    channel: '#drone',
                    username: 'Drone'
                });
                my.drone.flatTrim();
                my.drone.takeoff();
            } else {
                my.drone.land();
            }

            my.drone.on('battery', function(){
                slack.send({
                    text: ':battery:: ' + d.status.battery + '%',
                    channel: '#drone',
                    username: 'Drone'
                });
            });

            if(frame.valid && frame.gestures.length > 0){
                frame.gestures.forEach(function(g){
                    if(g.type == 'swipe'){
                        var currentPosition = g.position;
                        var startPosition = g.startPosition;

                        var xDirection = currentPosition[0] - startPosition[0];
                        var yDirection = currentPosition[1] - startPosition[1];
                        var zDirection = currentPosition[2] - startPosition[2];

                        var xAxis = Math.abs(xDirection);
                        var yAxis = Math.abs(yDirection);
                        var zAxis = Math.abs(zDirection);

                        var superiorPosition  = Math.max(xAxis, yAxis, zAxis);

                        if(superiorPosition === xAxis){
                            if(xDirection < 0){
                                my.drone.left();
                            } else {
                                my.drone.right();
                            }
                        }

                        if(superiorPosition === zAxis){
                            if(zDirection > 0){
                                my.drone.back();
                            } else {
                                my.drone.forward();
                            }
                        }

                        if(superiorPosition === yAxis){
                            if(yDirection > 0){
                                my.drone.up(1);
                            } else {
                                my.drone.down(1);
                            }
                        }

                    } else if(g.type === 'keyTap'){
                        my.drone.backFlip();
                        after((5).seconds(), function(){
                            my.drone.land();
                        })
                    }
                })
            }
        })
    }
}).start();
