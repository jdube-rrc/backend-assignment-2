// In-memory storage for mocked Firestore documents
const mockCollections: Record<string, Record<string, any>> = {};

// Seed initial data from the original data files
const seedMockData = (): void => {
    // Seed branches
    mockCollections['branches'] = {
        '1': { name: "Vancouver Branch", address: "1300 Burrard St, Vancouver, BC, V6Z 2C7", phone: "604-456-0022" },
        '2': { name: "Edmonton Branch", address: "7250 82 Ave NW, Edmonton, AB, T6B 0G4", phone: "780-468-6800" },
        '3': { name: "Arborg Branch", address: "317-A Fisher Road, Arborg, MB, R0C 0A0", phone: "204-555-3461" },
        '4': { name: "Regina Branch", address: "3085 Albert, Regina, SK, S4S 0B1", phone: "206-640-2877" },
        '5': { name: "Winnipeg Branch", address: "1 Portage Ave, Winnipeg, MB, R3B 2B9", phone: "204-988-2402" },
        '6': { name: "Steinbach Branch", address: "330 Main St, Steinbach, MB, R5G 1Z1", phone: "204-326-3495" },
        '7': { name: "Montréal Branch", address: "511 Rue Jean-Talon O, Montréal, QC, H3N 1R5", phone: "514-277-5511" },
        '8': { name: "Toronto Branch", address: "440 Queen St W, Toronto, ON, M5V 2A8", phone: "416-980-2500" },
        '9': { name: "Saint John Branch", address: "500 Fairville Blvd, Saint John, NB, E2M 5H7", phone: "506-632-0225" },
        '10': { name: "Headingley Branch", address: "500 McIntosh Rd, Headingley, MB, R4H 1B6", phone: "204-999-5555" },
    };

    // Seed employees  
    mockCollections['employees'] = {
        '1': { name: "Alice Johnson", position: "Branch Manager", department: "Management", email: "alice.johnson@pixell-river.com", phone: "604-555-0148", branchId: 1 },
        '2': { name: "Amandeep Singh", position: "Customer Service Representative", department: "Customer Service", email: "amandeep.singh@pixell-river.com", phone: "780-555-0172", branchId: 2 },
        '3': { name: "Maria Garcia", position: "Loan Officer", department: "Loans", email: "maria.garcia@pixell-river.com", phone: "204-555-0193", branchId: 3 },
    };
};

// Seed data initially
seedMockData();

// Always mock firebase in every test
jest.mock("../config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
        getUser: jest.fn(),
    },
    db: {
        collection: jest.fn((collectionName: string) => {
            // Initialize collection if it doesn't exist
            if (!mockCollections[collectionName]) {
                mockCollections[collectionName] = {};
            }

            // Store filters for where() queries
            const filters: Array<{ field: string; operator: string; value: any }> = [];

            const collectionRef = {
                doc: jest.fn((id: string) => ({
                    get: jest.fn().mockResolvedValue({
                        id,
                        exists: !!mockCollections[collectionName][id],
                        data: jest.fn().mockReturnValue(mockCollections[collectionName][id] || null),
                    }),
                    set: jest.fn().mockImplementation(async (data: any) => {
                        mockCollections[collectionName][id] = data;
                        return undefined;
                    }),
                    update: jest.fn().mockImplementation(async (data: any) => {
                        if (mockCollections[collectionName][id]) {
                            mockCollections[collectionName][id] = {
                                ...mockCollections[collectionName][id],
                                ...data
                            };
                        }
                        return undefined;
                    }),
                    delete: jest.fn().mockImplementation(async () => {
                        delete mockCollections[collectionName][id];
                        return undefined;
                    }),
                })),
                get: jest.fn().mockImplementation(async () => {
                    let docs = Object.entries(mockCollections[collectionName]).map(([id, data]) => ({
                        id,
                        exists: true,
                        data: () => data,
                    }));

                    // Apply filters if any where() calls were made
                    if (filters.length > 0) {
                        docs = docs.filter(doc => {
                            const docData = doc.data();
                            return filters.every(filter => {
                                if (filter.operator === '==') {
                                    return docData[filter.field] === filter.value;
                                }
                                return true;
                            });
                        });
                    }

                    return {
                        docs,
                        empty: docs.length === 0,
                    };
                }),
                where: jest.fn().mockImplementation((field: string, operator: string, value: any) => {
                    filters.push({ field, operator, value });
                    return collectionRef; // Return self for chaining
                }),
                add: jest.fn().mockResolvedValue({ id: 'mock-id' }),
            };

            return collectionRef;
        }),
        runTransaction: jest.fn((callback) => callback({
            get: jest.fn(),
            set: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        })),
        batch: jest.fn(() => ({
            set: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            commit: jest.fn().mockResolvedValue(undefined),
        })),
    },
}));

// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
    // Reset mock collections to seed data after each test
    Object.keys(mockCollections).forEach(key => delete mockCollections[key]);
    seedMockData();
});

// Cleanup after all tests in a file
afterAll(() => {
    jest.resetModules();
});
