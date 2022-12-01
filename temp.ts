{/* {store.teachers.map((t) => {
        return <option>{t}</option>
      })} */}

      // useServerMount$(async () => {
  //   // const res2 = await promises.readFile('/Users/yume/Desktop/Qwik/src/routes/yume/a.txt');
  //   const res2 = await promises.readFile('src/routes/yume/a.txt');
  //   // const res2 = await promises.readFile('/a.txt');
  //   const s = res2.toString('utf-8');
  //   console.log(s);
  //   console.log(process.cwd());
  //   store.data = s;
  // });

  // useServerMount$(async () => {
  //   // const response = await fetch('https://docs.google.com/uc?export=download&id=1Z2JCKMwixvCsSXp18e5YDX2GpTroZjnE');
  //   const r = await fetch('https://yume190.github.io/ssr/a.txt');
  //   // const r = await fetch('http://localhost/ssr/a.txt');
  //                      //  http://localhost:5173/yume
  //   // const r = await fetch('/a.txt');
  //   store.data = await r.text();
  // });

  // useClientEffect$(() => {
  //   const v = parseInt(document.cookie);
  //   store.cookie = document.cookie;
  //   if (isNaN(v)) {
  //     store.count = 0;
  //   } else {
  //     store.count = v;
  //   }
  //   return () => {
  //   };
  // });