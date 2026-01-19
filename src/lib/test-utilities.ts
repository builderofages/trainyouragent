/**
 * Automated Testing Utilities
 * Monitors console errors and validates dataLayer events
 */

// ============= Console Error Monitoring =============

export interface ConsoleError {
  type: 'error' | 'warn' | 'network';
  message: string;
  timestamp: number;
  stack?: string;
}

let errorMonitorActive = false;
const capturedErrors: ConsoleError[] = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

export const startConsoleMonitoring = () => {
  if (errorMonitorActive) return;
  
  errorMonitorActive = true;
  capturedErrors.length = 0;

  // Override console.error
  console.error = (...args: any[]) => {
    capturedErrors.push({
      type: 'error',
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '),
      timestamp: Date.now(),
      stack: new Error().stack
    });
    originalConsoleError.apply(console, args);
  };

  // Override console.warn
  console.warn = (...args: any[]) => {
    capturedErrors.push({
      type: 'warn',
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '),
      timestamp: Date.now()
    });
    originalConsoleWarn.apply(console, args);
  };

  // Monitor network failures
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      if (!response.ok) {
        capturedErrors.push({
          type: 'network',
          message: `Network failure: ${args[0]} - Status ${response.status}`,
          timestamp: Date.now()
        });
      }
      return response;
    } catch (error) {
      capturedErrors.push({
        type: 'network',
        message: `Network error: ${args[0]} - ${error}`,
        timestamp: Date.now()
      });
      throw error;
    }
  };

  console.log('✅ Console monitoring started');
};

export const stopConsoleMonitoring = () => {
  if (!errorMonitorActive) return;
  
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  errorMonitorActive = false;
  
  console.log('✅ Console monitoring stopped');
};

export const getConsoleErrors = (): ConsoleError[] => {
  return [...capturedErrors];
};

export const clearConsoleErrors = () => {
  capturedErrors.length = 0;
};

// ============= DataLayer Event Validation =============

export interface DataLayerValidationResult {
  valid: boolean;
  eventFound: boolean;
  missingParams: string[];
  invalidParams: { param: string; expectedType: string; actualType: string }[];
  event?: any;
}

export const validateDataLayerEvent = (
  eventName: string,
  expectedParams: Record<string, 'string' | 'number' | 'array' | 'object'>
): DataLayerValidationResult => {
  const dataLayer = (window as any).dataLayer || [];
  
  // Find the event in dataLayer
  const event = dataLayer.find((item: any) => item.event === eventName);
  
  if (!event) {
    return {
      valid: false,
      eventFound: false,
      missingParams: Object.keys(expectedParams),
      invalidParams: []
    };
  }

  const missingParams: string[] = [];
  const invalidParams: { param: string; expectedType: string; actualType: string }[] = [];

  // Check each expected parameter
  Object.entries(expectedParams).forEach(([param, expectedType]) => {
    if (!(param in event)) {
      missingParams.push(param);
      return;
    }

    const actualValue = event[param];
    const actualType = Array.isArray(actualValue) ? 'array' 
                     : actualValue === null ? 'null'
                     : typeof actualValue;

    if (expectedType === 'array' && !Array.isArray(actualValue)) {
      invalidParams.push({ param, expectedType, actualType });
    } else if (expectedType !== 'array' && actualType !== expectedType) {
      invalidParams.push({ param, expectedType, actualType });
    }
  });

  return {
    valid: missingParams.length === 0 && invalidParams.length === 0,
    eventFound: true,
    missingParams,
    invalidParams,
    event
  };
};

export const waitForDataLayerEvent = (
  eventName: string,
  timeoutMs: number = 5000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      const dataLayer = (window as any).dataLayer || [];
      const event = dataLayer.find((item: any) => item.event === eventName);
      
      if (event) {
        clearInterval(checkInterval);
        resolve(event);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(checkInterval);
        reject(new Error(`DataLayer event "${eventName}" not found within ${timeoutMs}ms`));
      }
    }, 100);
  });
};

// ============= Complete Test Suite =============

export interface TestResults {
  consoleErrors: ConsoleError[];
  dataLayerValidation: Record<string, DataLayerValidationResult>;
}

export const runCompleteTestSuite = async (
  expectedEvents: Record<string, Record<string, 'string' | 'number' | 'array' | 'object'>>
): Promise<TestResults> => {
  console.log('🧪 Running complete test suite...');

  // Start monitoring
  startConsoleMonitoring();

  // Wait for events to fire
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Validate dataLayer events
  const dataLayerValidation: Record<string, DataLayerValidationResult> = {};
  Object.entries(expectedEvents).forEach(([eventName, expectedParams]) => {
    dataLayerValidation[eventName] = validateDataLayerEvent(eventName, expectedParams);
  });

  // Get console errors
  const consoleErrors = getConsoleErrors();

  // Stop monitoring
  stopConsoleMonitoring();

  // Log results
  console.log('\n📊 Test Results:');
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`DataLayer Events Validated: ${Object.keys(dataLayerValidation).length}`);

  return {
    consoleErrors,
    dataLayerValidation
  };
};
