const {test,before,after} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright');
const {createServer} = require('../scripts/serve.cjs');
let server,browser,base;
const errors=[];
const artifacts=path.join(__dirname,'..','.artifacts');
before(async()=>{
 server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true});await fs.mkdir(artifacts,{recursive:true});
});
after(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));});
async function page(options={}){
 const context=await browser.newContext({viewport:{width:1440,height:1000},...options});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/',{waitUntil:'networkidle'});return {page,context};
}
test('complete portfolio, local assets and unique IDs',async()=>{
 const {page:p,context}=await page();assert.equal(await p.locator('.app-grid .app').count(),25);assert.equal(await p.locator('.web-grid .app').count(),12);
 assert.match(await p.locator('#result-count').innerText(),/37/);
 const problems=await p.evaluate(async()=>{
  const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);const issues=ids.filter((x,i)=>ids.indexOf(x)!==i).map(x=>'Duplicate ID '+x);
  const urls=[...new Set([...document.querySelectorAll('[src],a[href],link[href]')].map(x=>x.getAttribute('src')||x.getAttribute('href')).filter(x=>x&&!x.startsWith('#')&&!x.startsWith('mailto:')&&!x.startsWith('http')))];
  for(const url of urls){const r=await fetch(url);if(!r.ok)issues.push(url+' '+r.status);}return issues;
 });assert.deepEqual(problems,[]);await context.close();
});
test('search, category and platform intersect with recoverable empty state',async()=>{
 const {page:p,context}=await page();await p.locator('#portfolio-search').fill('PixZap');assert.equal(await p.locator('.app-grid .app:visible').count(),1);
 await p.locator('[data-filter=pets]').click();assert(await p.locator('#empty-state').isVisible());assert.match(await p.locator('#result-count').innerText(),/0/);
 await p.locator('#clear-filters').click();assert.equal(await p.locator('.app-grid .app:visible').count(),25);
 await p.locator('#platform-filter').selectOption('web');assert.equal(await p.locator('.app-grid .app:visible').count(),0);assert.equal(await p.locator('.web-grid .app:visible').count(),12);
 await p.locator('[data-filter=pets]').click();assert.equal(await p.locator('.web-grid .app:visible').count(),1);
 await p.locator('#clear-filters').click();await p.locator('#platform-filter').selectOption('android');assert(await p.locator('#pixzap').isVisible());
 assert.equal(await p.locator('.app-grid .app:visible').evaluateAll(xs=>xs.every(x=>x.dataset.platform.split(' ').includes('android'))),true);
 await p.locator('#portfolio-search').fill('  ＰｉｘＺａｐ  ');assert.equal(await p.locator('.app-grid .app:visible').count(),1);await context.close();
});
test('featured download anchors reveal products hidden by all filters',async()=>{
 const {page:p,context}=await page();await p.locator('[data-filter=pets]').click();await p.locator('#platform-filter').selectOption('web');await p.locator('#portfolio-search').fill('no-result');
 assert.equal(await p.locator('#pixzap').isVisible(),false);await p.locator('a.download-jump[href="#pixzap"]').click();await p.waitForFunction(()=>!document.querySelector('#pixzap').closest('[hidden]'));
 assert(await p.locator('#pixzap').isVisible());assert.equal(await p.locator('#portfolio-search').inputValue(),'');assert.equal(await p.locator('#platform-filter').inputValue(),'all');
 await p.locator('[data-filter=pets]').click();await p.locator('.site-nav a[href="/#web-projects"]').click();assert(await p.locator('#web-projects').isVisible());await context.close();
});
test('four languages update titles, product names, state, accessibility labels and persist',async()=>{
 const {page:p,context}=await page();for(const [lang,htmlLang] of [['en','en'],['ja','ja'],['ko','ko'],['zh','zh-Hant']]){
  await p.locator('[data-language='+lang+']').click();assert.equal(await p.locator('html').getAttribute('lang'),htmlLang);assert.equal(await p.locator('[data-language='+lang+']').getAttribute('aria-pressed'),'true');
  assert.equal(await p.evaluate(()=>[...document.querySelectorAll('[data-i18n]')].some(x=>!x.textContent.trim()||x.textContent.includes('undefined'))),false);
  if(lang==='en'){assert.match(await p.title(),/Independent/);assert.match(await p.locator('#pixzap .app-name').innerText(),/Photo editor/);assert.equal(await p.locator('#upcoming .ios-badge').innerText(),'iOS under review');assert.equal(await p.locator('meta[name=description]').getAttribute('content'),await p.locator('meta[property="og:description"]').getAttribute('content'));}
 }
 await p.locator('[data-language=en]').click();await p.reload();assert.equal(await p.locator('html').getAttribute('lang'),'en');await p.locator('a[href^="/apps/pixzap/"]').first().click();assert.equal(await p.locator('html').getAttribute('lang'),'en');assert.match(await p.title(),/Photo editor/);await context.close();
});
test('responsive layout and menu at 320, 390, 768 and 1440px in four languages',async()=>{
 const {page:p,context}=await page();for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});for(const lang of ['zh','en','ja','ko']){
  await p.locator('[data-language='+lang+']').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)){console.log('Overflow details',await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(x=>{const r=x.getBoundingClientRect();return r.width&&r.right>innerWidth+1}).map(x=>({tag:x.tagName,class:x.className,text:x.textContent.slice(0,80),right:x.getBoundingClientRect().right,width:x.getBoundingClientRect().width})).slice(0,20)));await p.screenshot({path:path.join(artifacts,'overflow.png'),fullPage:true});}assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,width+' '+lang+' overflows');
 }
 if(width<=900){await p.locator('.menu-toggle').click();assert(await p.locator('.site-nav').isVisible());await p.keyboard.press('Escape');assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
 }
 await p.setViewportSize({width:390,height:844});await p.locator('[data-language=zh]').click();await p.screenshot({path:path.join(artifacts,'home-mobile.png'),fullPage:true});await p.setViewportSize({width:1440,height:1000});await p.screenshot({path:path.join(artifacts,'home-desktop.png'),fullPage:true});await context.close();
});
test('product pages have working downloads, localized metadata and support links',async()=>{
 const {page:p,context}=await page();for(const slug of ['roadguard','pixzap','snifflo']){
  await p.goto(base+'/apps/'+slug+'/?lang=en');assert.match(await p.title(),new RegExp(slug,'i'));assert.equal(await p.locator('.product-intro .store-links a').count(),2);assert(await p.locator('a[href="/privacy/'+slug+'/"]').isVisible());
  for(const lang of ['zh','en','ja','ko']){await p.locator('[data-language='+lang+']').click();assert.equal(await p.evaluate(()=>[...document.querySelectorAll('[data-i18n]')].some(x=>!x.textContent.trim()||x.textContent.includes('undefined'))),false);for(const width of [320,768,1440]){await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,slug+' '+lang+' '+width);}}
  await p.setViewportSize({width:1440,height:1000});await p.locator('[data-language=zh]').click();await p.screenshot({path:path.join(artifacts,slug+'-desktop.png'),fullPage:true});
 }
 await context.close();
});
test('no-JavaScript fallback retains complete content and mobile navigation',async()=>{
 const {page:p,context}=await page({javaScriptEnabled:false,viewport:{width:390,height:844}});assert.equal(await p.locator('.app-grid .app:visible').count(),25);assert.equal(await p.locator('.web-grid .app:visible').count(),12);assert(await p.locator('.site-nav').isVisible());assert.equal(await p.locator('.explorer-controls').isVisible(),false);await context.close();
});
test('reduced motion, sitemap, metadata and JavaScript errors',async()=>{
 const {page:p,context}=await page({reducedMotion:'reduce'});assert.equal(await p.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');assert.equal(await p.locator('meta[property="og:image"]').getAttribute('content'),'https://tengrip.github.io/assets/og-cover.png');
 const sitemap=await (await p.request.get(base+'/sitemap.xml')).text();for(const m of sitemap.matchAll(new RegExp('<loc>https://tengrip[.]github[.]io(.*?)</loc>','g'))){assert.equal((await p.request.get(base+m[1])).status(),200,m[1]);}
 assert.deepEqual(errors,[]);await context.close();
});
