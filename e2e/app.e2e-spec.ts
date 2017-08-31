import { DayrnetPage } from './app.po';

describe('dayrnet App', () => {
  let page: DayrnetPage;

  beforeEach(() => {
    page = new DayrnetPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
