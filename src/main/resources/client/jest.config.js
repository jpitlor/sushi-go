module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(png|css|pdf|jpg|jpeg|ico)": "<rootDir>/utils/fileMock.ts",
  },
};
