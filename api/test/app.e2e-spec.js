"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("./../src/app.module");
describe('AppController (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmUyZS1zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLmUyZS1zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQXNEO0FBRXRELHFDQUFxQztBQUNyQyxvREFBZ0Q7QUFFaEQsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUNuQyxJQUFJLEdBQXFCLENBQUM7SUFFMUIsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLE1BQU0sYUFBYSxHQUFrQixNQUFNLGNBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUNsRSxPQUFPLEVBQUUsQ0FBQyxzQkFBUyxDQUFDO1NBQ3JCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUViLEdBQUcsR0FBRyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM1QyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ2pCLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUNoQyxHQUFHLENBQUMsR0FBRyxDQUFDO2FBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVzdCwgVGVzdGluZ01vZHVsZSB9IGZyb20gJ0BuZXN0anMvdGVzdGluZyc7XG5pbXBvcnQgeyBJTmVzdEFwcGxpY2F0aW9uIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0ICogYXMgcmVxdWVzdCBmcm9tICdzdXBlcnRlc3QnO1xuaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi8uLi9zcmMvYXBwLm1vZHVsZSc7XG5cbmRlc2NyaWJlKCdBcHBDb250cm9sbGVyIChlMmUpJywgKCkgPT4ge1xuICBsZXQgYXBwOiBJTmVzdEFwcGxpY2F0aW9uO1xuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZUZpeHR1cmU6IFRlc3RpbmdNb2R1bGUgPSBhd2FpdCBUZXN0LmNyZWF0ZVRlc3RpbmdNb2R1bGUoe1xuICAgICAgaW1wb3J0czogW0FwcE1vZHVsZV0sXG4gICAgfSkuY29tcGlsZSgpO1xuXG4gICAgYXBwID0gbW9kdWxlRml4dHVyZS5jcmVhdGVOZXN0QXBwbGljYXRpb24oKTtcbiAgICBhd2FpdCBhcHAuaW5pdCgpO1xuICB9KTtcblxuICBpdCgnLyAoR0VUKScsICgpID0+IHtcbiAgICByZXR1cm4gcmVxdWVzdChhcHAuZ2V0SHR0cFNlcnZlcigpKVxuICAgICAgLmdldCgnLycpXG4gICAgICAuZXhwZWN0KDIwMClcbiAgICAgIC5leHBlY3QoJ0hlbGxvIFdvcmxkIScpO1xuICB9KTtcbn0pO1xuIl19