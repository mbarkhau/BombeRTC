
// var echo_peer = new Peer({
// 	key: 'e8r25j5bwewmi',
// 	secure: false
// });

// var counter = 0;

// echo_peer.on('open', function(id) {
// 	log('My peer ID is: ' + id);

// 	// echo connection
// 	echo_peer.on('connection', function(conn) {
// 		conn.on('data', function(data) {
// 			net_stats(1)
// 			conn.send(data);
// 			net_stats(0)
// 		});
// 	});
// });

// var peer = new Peer({
// 	key: 'e8r25j5bwewmi',
// 	secure: false
// });

// function init_conn(peer_id) {
// 	log("Connecting to:" + peer_id);
// 	var conn = peer.connect(peer_id, {
// 		label: "unreliable_conn",
// 		reliable: false
// 	});

// 	conn.on('data', function(data) {
// 		var old_counter = parseInt(data.split(":")[0], 10);
// 		if (counter != old_counter) {
// 			log("out of order/dropped packet: " + coutner + " " + old_counter);
// 		}
// 		counter += 1;
// 		net_stats(1);
// 		net_stats(0);
// 		conn.send(counter + ":" + mk_blob(800));
// 	});
// 	conn.on('open', function() {
// 		net_stats(0);
// 		conn.send(counter + ":" + mk_blob(100));
// 	});
// }
