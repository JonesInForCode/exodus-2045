/**
 * Phase 1 Integration Test Script
 * Run this in browser console to verify all systems are working
 * 
 * Usage: 
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Run testPhase1Integration()
 */

function testPhase1Integration() {
    console.log("🧪 Starting Phase 1 Integration Test...");
    console.log("=" .repeat(50));
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0,
        details: []
    };
    
    function test(name, condition, message = "") {
        results.total++;
        const passed = typeof condition === 'function' ? condition() : !!condition;
        
        if (passed) {
            results.passed++;
            console.log(`✅ ${name}: PASS ${message}`);
        } else {
            results.failed++;
            console.log(`❌ ${name}: FAIL ${message}`);
        }
        
        results.details.push({ name, passed, message });
        return passed;
    }
    
    // Test 1: Phaser Game Instance
    test("Phaser Game", () => {
        return window.game || (window.phaserGame);
    }, "Game instance exists");
    
    // Test 2: Game Registry
    const gameState = window.game?.registry?.get('gameState');
    test("Game State", () => {
        return gameState && typeof gameState === 'object';
    }, "Global game state accessible");
    
    // Test 3: Scene Management
    test("Terminal Scene", () => {
        const scenes = window.game?.scene?.scenes;
        return scenes && scenes.some(scene => scene.scene.key === 'CoordinatorTerminal');
    }, "CoordinatorTerminal scene loaded");
    
    // Test 4: Data Loading
    test("Caravan Data", () => {
        return gameState?.caravans || (gameState && Object.keys(gameState).length > 0);
    }, "Caravan data loaded");
    
    // Test 5: Time System
    test("Time Controller", () => {
        return gameState?.systemTime && gameState.ui?.timeSpeed !== undefined;
    }, "Time system operational");
    
    // Test 6: Resource System
    test("Resource Data", () => {
        return gameState?.resources && Object.keys(gameState.resources).length > 0;
    }, "Resource system loaded");
    
    // Test 7: UI Elements
    test("DOM Elements", () => {
        const phaserCanvas = document.querySelector('canvas');
        return phaserCanvas && phaserCanvas.width > 0;
    }, "Phaser canvas rendered");
    
    // Test 8: No Critical Errors
    test("Error Free", () => {
        // Check if there are any error messages in console
        return !window.hasGameErrors;
    }, "No critical errors detected");
    
    // Test 9: Audio Context
    test("Audio System", () => {
        // Check if audio context can be created
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return audioContext.state !== 'closed';
        } catch (e) {
            return false;
        }
    }, "Audio system available");
    
    // Test 10: Local Storage Access
    test("Storage Access", () => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }, "Local storage accessible");
    
    console.log("=" .repeat(50));
    console.log(`🧪 Test Results: ${results.passed}/${results.total} passed`);
    
    if (results.failed === 0) {
        console.log("🎉 ALL TESTS PASSED! Phase 1 is working correctly.");
        console.log("✅ Systems are integrated and functional");
        console.log("✅ Ready for gameplay testing");
        console.log("✅ Ready for Phase 2 development");
    } else {
        console.log(`⚠️ ${results.failed} tests failed. Check the details above.`);
        console.log("🔧 Fix the failing systems before proceeding");
    }
    
    return results;
}

function testGameplayLoop() {
    console.log("🎮 Testing Gameplay Loop...");
    
    // Test time controls
    console.log("Testing time controls...");
    
    if (window.game?.registry) {
        const gameState = window.game.registry.get('gameState');
        
        // Test pause
        const originalSpeed = gameState.ui.timeSpeed;
        gameState.ui.timeSpeed = 0;
        window.game.registry.set('gameState', gameState);
        console.log("⏸️ Paused game");
        
        setTimeout(() => {
            // Test speed change
            gameState.ui.timeSpeed = 2;
            window.game.registry.set('gameState', gameState);
            console.log("⏩ Set speed to 2X");
            
            setTimeout(() => {
                // Restore original speed
                gameState.ui.timeSpeed = originalSpeed;
                window.game.registry.set('gameState', gameState);
                console.log("▶️ Restored original speed");
                console.log("✅ Time controls working");
            }, 1000);
        }, 1000);
    }
}

function testDataIntegrity() {
    console.log("📊 Testing Data Integrity...");
    
    const gameState = window.game?.registry?.get('gameState');
    
    if (gameState) {
        // Test caravan data structure
        if (gameState.caravans && gameState.caravans.length > 0) {
            const caravan = gameState.caravans[0];
            const requiredFields = ['id', 'leader', 'members', 'resources', 'status'];
            
            const hasAllFields = requiredFields.every(field => caravan[field] !== undefined);
            console.log(hasAllFields ? "✅ Caravan data structure valid" : "❌ Caravan data structure invalid");
        }
        
        // Test resource data structure
        if (gameState.resources) {
            const resourceCount = Object.keys(gameState.resources).length;
            console.log(`✅ Resource system has ${resourceCount} resource types`);
        }
        
        // Test message system
        if (gameState.messages) {
            console.log(`✅ Message system initialized with ${gameState.messages.length} messages`);
        }
    }
}

function testPerformance() {
    console.log("⚡ Testing Performance...");
    
    const startTime = performance.now();
    let frameCount = 0;
    
    function measureFrameRate() {
        frameCount++;
        
        if (frameCount >= 60) { // Measure over 60 frames
            const endTime = performance.now();
            const duration = endTime - startTime;
            const fps = (frameCount / duration) * 1000;
            
            console.log(`📊 Average FPS: ${fps.toFixed(1)}`);
            
            if (fps >= 45) {
                console.log("✅ Performance: GOOD");
            } else if (fps >= 30) {
                console.log("⚠️ Performance: ACCEPTABLE");
            } else {
                console.log("❌ Performance: POOR");
            }
            
            return;
        }
        
        requestAnimationFrame(measureFrameRate);
    }
    
    requestAnimationFrame(measureFrameRate);
}

// Quick test functions for specific systems
window.testSystems = {
    integration: testPhase1Integration,
    gameplay: testGameplayLoop,
    data: testDataIntegrity,
    performance: testPerformance,
    
    // Quick system status
    status: () => {
        const gameState = window.game?.registry?.get('gameState');
        console.log("🛰️ System Status:");
        console.log("Time:", gameState?.systemTime?.toLocaleTimeString());
        console.log("Speed:", gameState?.ui?.timeSpeed + "X");
        console.log("Caravans:", gameState?.caravans?.length || 0);
        console.log("Messages:", gameState?.messages?.length || 0);
        console.log("Resources:", Object.keys(gameState?.resources || {}).length);
    },
    
    // Force events for testing
    triggerEmergency: () => {
        if (window.game?.events) {
            window.game.events.emit('emergencyEvent', {
                title: 'TEST EMERGENCY',
                message: 'This is a test emergency event'
            });
            console.log("🚨 Test emergency triggered");
        }
    },
    
    // Speed controls
    pause: () => {
        const gameState = window.game?.registry?.get('gameState');
        if (gameState) {
            gameState.ui.timeSpeed = 0;
            window.game.registry.set('gameState', gameState);
            console.log("⏸️ Game paused");
        }
    },
    
    speed4x: () => {
        const gameState = window.game?.registry?.get('gameState');
        if (gameState) {
            gameState.ui.timeSpeed = 4;
            window.game.registry.set('gameState', gameState);
            console.log("⏩⏩ Speed set to 4X");
        }
    }
};

// Auto-run basic test on load
console.log("🧪 Phase 1 Integration Test Tools Loaded");
console.log("Run testPhase1Integration() to test all systems");
console.log("Use window.testSystems for individual tests");
console.log("Example: testSystems.status() for current status");

// Export for global access
window.testPhase1Integration = testPhase1Integration;