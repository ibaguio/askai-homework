import { Controller, Path, Route, Get } from 'tsoa';

interface TestResponse {
    isWorking: boolean;
}

@Route('test')
export class TestController extends Controller {
    @Get('')
    public async getTest(): Promise<TestResponse> {
        return { isWorking: true };
    }
}
