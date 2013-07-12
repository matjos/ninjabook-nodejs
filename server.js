#!/usr/bin/env node

// making sure ninjas are loaded before starting express
require('./src/ninjas').requestNinjas().then(function() {
	require('./src/web/app');	
});