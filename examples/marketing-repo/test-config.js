#!/usr/bin/env node

// Simple test to verify configuration loading
import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'js-yaml';

async function testConfig() {
  try {
    const configPath = path.join(process.cwd(), 'repo2content.config.yaml');
    console.log('Testing config file:', configPath);
    
    if (!await fs.pathExists(configPath)) {
      console.error('❌ Config file not found');
      return;
    }
    
    const raw = await fs.readFile(configPath, 'utf8');
    const config = yaml.load(raw);
    
    console.log('✅ Config loaded successfully:');
    console.log(JSON.stringify(config, null, 2));
    
    // Validate structure
    if (!config.sources || !Array.isArray(config.sources)) {
      console.error('❌ Invalid config: missing or invalid sources array');
      return;
    }
    
    console.log('✅ Config structure is valid');
    
  } catch (error) {
    console.error('❌ Error loading config:', error.message);
  }
}

testConfig();
