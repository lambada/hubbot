module.exports = {
	getRawListingLogs: async (bot, server) => {
		return new Promise(res => {
			bot.db.query(`SELECT * FROM listing_logs WHERE server_id = ?`, [server], {
				id: Number,
				hid: String,
				server_id: String,
				channel_id: String,
				message_id: String,
				server_name: String,
				reason: String,
				timestamp: String,
				type: Number
			}, async (err, rows) => {
				if(err) {
					console.log(err);
					res(undefined);
				} else {
					if(rows[0]) res(rows);
					else res(undefined)
				}
			})
		})
	},
	getListingLogs: async (bot, server) => {
		return new Promise(res => {
			bot.db.query(`SELECT * FROM listing_logs WHERE server_id = ?`, [server], {
				id: Number,
				hid: String,
				server_id: String,
				channel_id: String,
				message_id: String,
				server_name: String,
				reason: String,
				timestamp: String,
				type: Number
			}, async (err, rows) => {
				if(err) {
					console.log(err);
					res(undefined);
				} else {
					if(rows[0]) {
						var logs = [];
						for(var i = 0; i < rows.length; i++) {
							var message;

							try {
								message = await bot.getMessage(rows[i].channel_id, rows[i].message_id);
							} catch(e) {
								console.log(e.stack);
								await bot.utils.deleteBanLog(bot, rows[i].hid, server);
								continue;
							}

							rows[i].embed = message.embeds[0];
							logs.push(rows[i]);
						}

						res(logs);
					} else res(undefined)
				}
			})
		})
	},
	getListingLog: async (bot, hid, server) => {
		return new Promise(res => {
			bot.db.query(`SELECT * FROM listing_logs WHERE hid = ? AND server_id = ?`, [hid, server], {
				id: Number,
				hid: String,
				server_id: String,
				channel_id: String,
				message_id: String,
				server_name: String,
				reason: String,
				timestamp: String,
				type: Number
			}, async (err, rows) => {
				if(err) {
					console.log(err);
					res(undefined);
				} else {
					if(rows[0]) {
						var message;

						try {
							message = await bot.getMessage(rows[0].channel_id, rows[0].message_id);
						} catch(e) {
							console.log(e.stack);
							await bot.utils.deleteBanLog(bot, rows[0].hid, server);
							return res(undefined);
						}

						rows[0].embed = message.embeds[0];
						res(rows[0]);
					} else res(undefined)
				}
			})
		})
	},
	getRawListingLogByMessage: async (bot, server, channel, message) => {
		return new Promise(res => {
			bot.db.query(`SELECT * FROM listing_logs WHERE server_id = ? AND channel_id = ? AND message_id = ?`, [server, channel, message], {
				id: Number,
				hid: String,
				server_id: String,
				channel_id: String,
				message_id: String,
				server_name: String,
				reason: String,
				timestamp: String,
				type: Number
			}, async (err, rows) => {
				if(err) {
					console.log(err);
					res(undefined);
				} else {
					res(rows[0]);
				}
			})
		})
	},
	addListingLog: async (bot, hid, server, channel, message, name, reason, timestamp, type) => {
		return new Promise(res => {
			bot.db.query(`INSERT INTO listing_logs (hid, server_id, channel_id, message_id, server_name, reason, timestamp, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[hid, server, channel, message, name, reason || "(no reason given)", timestamp || new Date(), type], (err, rows) => {
				if(err) {
					console.log(err);
					res(false);
				} else {
					res(true)
				}
			})
		})
	},
	deleteListingLog: async (bot, hid, server) => {
		return new Promise(res => {
			bot.db.query(`DELETE FROM listing_logs WHERE hid = ? AND server_id = ?`, [hid, server], async (err, rows) => {
				if(err) {
					console.log(err);
					res(false)
				} else {
					res(true);
				}
			})
		})
	},
	deleteListingLogs: async (bot, server) => {
		return new Promise(res => {
			bot.db.query(`DELETE FROM listing_logs server_id = ?`, [server], async (err, rows) => {
				if(err) {
					console.log(err);
					res(false)
				} else {
					res(true);
				}
			})
		})
	},
	updateListingLog: async (bot, hid, server, data) => {
		return new Promise(async res => {
			bot.db.query(`UPDATE listing_logs SET ${Object.keys(data).map((k) => k+"=?").join(",")} WHERE hid = ? AND server_id=?`,[...Object.values(data), hid, server], (err, rows)=> {
				if(err) {
					console.log(err);
					res(false)
				} else {
					res(true)
				}
			})
		})
	},

	//receipts
	getReceipts: async (bot, server) => {
		return new Promise(res => {
			bot.db.query(`SELECT * FROM receipts WHERE server_id = ?`, [server], 
			{
				id: Number,
				hid: String,
				server_id: String,
				message: String,
				link: String
			}, (err, rows) => {
				if(err) {
					console.log(err);
					res(undefined);
				} else {
					res(rows)
				}
			})
		})
	},
	getReceipt: async (bot, hid, server) => {
		return new Promise(res => {
			bot.db.query(`SELECT * FROM receipts WHERE hid = ? AND server_id = ?`, [hid, server],
			{
				id: Number,
				hid: String,
				server_id: String,
				message: String,
				link: String
			}, (err, rows) => {
				if(err) {
					console.log(err);
					res(undefined);
				} else {
					res(rows[0])
				}
			})
		})
	},
	addReceipt: async (bot, hid, server, message) => {
		return new Promise(res => {
			bot.db.query(`INSERT INTO receipts (hid, server_id, message, link) VALUES (?, ?, ?, ?)`, [hid, server, message, ""], (err, rows) => {
				if(err) {
					console.log(err);
					res(false);
				} else {
					res(true);
				}
			})
		})
	},
	editReceipt: async (bot, hid, server, key, val) => {
		return new Promise(res => {
			bot.db.query(`UPDATE receipts SET ? = ? WHERE hid = ? AND server_id = ?`, [key, val, hid, server], (err, rows) => {
				if(err) {
					console.log(err);
					res(false);
				} else {
					res(true);
				}
			})
		})
	},
	deleteReceipt: async (bot, hid, server) => {
		return new Promise(res => {
			bot.db.query(`DELETE FROM receipts WHERE hid = ? AND server_id = ?`, [hid, server], (err, rows) => {
				if(err) {
					console.log(err);
					res(false);
				} else {
					res(true)
				}
			})
		})
	},
	deleteReceipts: async (bot, server) => {
		return new Promise(res => {
			bot.db.query(`DELETE FROM receipts WHERE server_id = ?`, [server], (err, rows) => {
				if(err) {
					console.log(err);
					res(false);
				} else {
					res(true)
				}
			})
		})
	},
	linkReceipts: async (bot, server, hid1, hid2, message) => {
		return new Promise(async res => {
			var receipt = await bot.utils.getReceipt(bot, hid1, server);
			var receipt2 = await bot.utils.getReceipt(bot, hid2, server);
			if(!receipt) {
				bot.db.query(`INSERT INTO receipts (hid, server_id, message, link) VALUES (?,?,?,?)`, [hid1, server, message, receipt2.link || hid2], (err, rows)=> {
					if(err) {
						console.log(err);
						res(false);
					} else {
						bot.db.query(`UPDATE receipts SET message=?, link=? WHERE hid=? AND server_id=?`, [message, receipt2.link || hid2, hid2, server], (err, rows)=> {
							if(err) {
								console.log(err);
								res(false);
							} else {
								res(true)
							}
						})
						
					}
				})
			} else if(!receipt2) {
				bot.db.query(`INSERT INTO receipts (hid, server_id, message, link) VALUES (?,?,?,?)`, [hid2, server, message, hid2], (err, rows)=> {
					if(err) {
						console.log(err);
						res(false);
					} else {
						bot.db.query(`UPDATE receipts SET message=?, link=? WHERE hid=? AND server_id=?`, [message, hid2, hid1, server], (err, rows)=> {
							if(err) {
								console.log(err);
								res(false);
							} else {
								res(true)
							}
						})
					}
				})
			} else {
				bot.db.query(`UPDATE receipts SET message=?, link=? WHERE hid=? AND server_id=?;
							  UPDATE receipts SET message=?, link=? WHERE hid=? AND server_id=?`,
							  [message, receipt2.link || hid2, hid1, server,
							   message, receipt2.link || hid2, hid2, server], (err, rows)=> {
					if(err) {
						console.log(err);
						res(false);
					} else {
						res(true)
					}
				})
			}
		})
	},
	getLinkedReceipts: async (bot, server, hid) => {
		return new Promise(res => {
			bot.db.query(`SELECT * FROM receipts WHERE link = ? AND server_id = ?`, [hid, server],
			{
				id: Number,
				hid: String,
				server_id: String,
				message: String,
				link: String
			}, (err, rows) => {
				if(err) {
					console.log(err);
					res(undefined);
				} else {
					res(rows)
				}
			})
		})
	}
}