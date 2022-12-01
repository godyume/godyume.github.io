import { component$, useClientEffect$, useStore, useStylesScoped$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { Env, Teacher } from '~/logic/Tuning';
import { Elements, Setting } from './setting';

import styles from './table.css?inline';


export class Global {
  sols: Env[] = [];
  setting: Setting;
  constructor() {
    this.sols = []
    this.setting = new Setting()
    //new Setting()
  }
}

export const env = new Env();
export const _global: Global = new Global();
export const _global2: Setting = new Setting()

export default component$(() => {
  useStylesScoped$(styles);

  const store = useStore({
    /// 所有老師
    // teachers: new Array<string>(),
    /// 選中老師名稱
    sTeacher: '',

    /// 被選中的課堂
    index: 0,

    /// 可調動幾次，N 角調課
    // steps: 2,

    // isOrder: true,

    sol: '',
  });


  useClientEffect$(() => {

    _global.setting = Setting.load(document.cookie)

    const sDay = document.getElementById(Elements.selectDays) as HTMLSelectElement
    sDay!.selectedIndex = _global.setting.days - 1


    const sCourse = document.getElementById(Elements.selectCourses) as HTMLSelectElement
    sCourse!.selectedIndex = _global.setting.courses - 1

    const sIsOrder = document.getElementById(Elements.selectIsOrder) as HTMLSelectElement
    sIsOrder!.selectedIndex = _global.setting.isOrder ? 0 : 1

    const sStep = document.getElementById(Elements.selectSteps) as HTMLSelectElement
    sStep!.selectedIndex = _global.setting.steps - 1


    for (const name in _global.setting.teachers) {
      const raw = _global.setting.teachers[name]
      env.setup(name, raw)
    }

    const s = document.getElementById(Elements.selectTeacher)
    for (const t of env.teachers()) {
      const opt = document.createElement('option');
      opt.value = t;
      opt.innerHTML = t;
      s?.appendChild(opt);
    }
  });

  return (
    <>
      <div>
        <h1 style='color:#e33'>不會對班級名稱為 `x` 或 `X` 進行調課</h1>
        <div class={"row"}>
          <div class={"column"}>
            <h2>設定</h2>

            <p>每週上課天數</p>
            <select id={Elements.selectDays} onChange$={(event) => {
              const v = event.target.value
              _global.setting.setDays(+v)
              env.setDays(+v)
            }}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option selected value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
            </select>

            <hr />

            <p>每天上課節數</p>
            <select id={Elements.selectCourses} onChange$={(event) => {
              const v = event.target.value
              _global.setting.setCourses(+v)
              env.setCourses(+v)
            }}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option selected value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
            </select>

            <hr />

            <p>星期排序</p>
            <select id={Elements.selectIsOrder} onChange$={(event) => {
              const v = event.target.value
              _global.setting.setIsOrder(v === "1")
            }}>
              <option selected value={1}>正(一~日)</option>
              <option value={2}>反(日~一)</option>
            </select>

            <hr />

            <p>最多連續調課 N 次</p>
            <select id={Elements.selectSteps} onChange$={(event) => {
              const v = event.target.value
              _global.setting.setSteps(+v)
            }}>
              <option value={1}>1</option>
              <option selected value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>

            <hr />

            <p>請選擇檔案</p>
            <input
              type="file"
              id="input"
              // data-target="file-uploader" 
              // accept="text/plain;charset=UTF-8"
              accept="text"
              multiple
              onChange$={async (event) => {
                const files = event.target.files;
                if (files) {
                  const teachers: { [key: string]: string } = {}

                  for (const file of files) {
                    const name = file.name.split('.')[0].toString()
                    const raw = await file.text();
                    teachers[name] = raw
                  }
                  _global.setting.setTeachers(teachers)
                } else {
                  _global.setting.setTeachers({})
                }

                for (const name in _global.setting.teachers) {
                  const raw = _global.setting.teachers[name]
                  env.setup(name, raw)
                }

                const s = document.getElementById(Elements.selectTeacher)
                for (const t of env.teachers()) {
                  const opt = document.createElement('option');
                  opt.value = t;
                  opt.innerHTML = t;
                  s?.appendChild(opt);
                }
              }}
            />

            <hr />

            <p>請選擇老師</p>
            <select size={5} id={Elements.selectTeacher} onChange$={(event) => {
              // clean(Elements.originTable)
              // clean(Elements.toTable)
              // clean(Elements.selectSol)

              const t = event.target.value
              store.sTeacher = t
              const teacher = new Teacher(t)
              // const a = env.findByTeacher(teacher).map((t) => t.toString())

              const table = document.getElementById(Elements.originTable)
              if (table) {
                env.renderTable(table, teacher, _global.setting.isOrder, (num, cell) => {
                  const previous = document.getElementById(`o${store.index}`)
                  if (previous) {
                    previous.style.background = '#fff'
                  }
                  store.index = num
                  cell.style.background = '#cc0'

                  _global.sols = env.change(teacher, num, _global.setting.steps)
                    .sort((l, r) => l.changes.length - r.changes.length)
                  // clean(Elements.toTable)
                  // clean(Elements.selectSol)

                  if (_global.sols.length > 0) {
                    const s = document.getElementById(Elements.selectSol)!
                    s!.innerHTML = ''
                    for (const [index, sol] of _global.sols.entries()) {
                      const option = document.createElement('option')
                      if (index == 0) {
                        option.selected = true
                        const table2 = document.getElementById('toTable')
                        if (table2) {
                          sol.renderTable2(table2, teacher, _global.setting.isOrder)
                          const xxx = sol.changes.map((s) => s.toString()).join(`<br>`)
                          store.sol = xxx
                        }
                      }
                      option.value = index.toString()
                      option.innerHTML = `結果 ${index} ${sol.changes.length}步驟`
                      s?.appendChild(option)
                    }
                    // const table2 = document.getElementById('toTable')

                    // if (table2)
                    //   sols[0].renderTable2(table2, teacher)
                  }
                })
              }
            }}>
            </select>

            <hr />

            <p>請選擇結果</p>
            <select size={5} id={Elements.selectSol} onChange$={(event) => {
              const index = event.target.value
              const teacher = new Teacher(store.sTeacher)
              const table = document.getElementById('toTable')
              const sol = _global.sols[+index]
              if (table)
                sol.renderTable2(table, teacher, _global.setting.isOrder)

              const xxx = sol.changes.map((s) => s.toString()).join('<br>\n')
              store.sol = xxx
            }}>
            </select>
          </div>

          <div class={"column"}>
            <p>原課表</p>
            <table id={Elements.originTable}></table>

            <p>調課後課表</p>
            <table id={Elements.toTable}></table>
          </div>
        </div>

        <p>index: {store.index}</p>
        <p>sols: {store.sol}</p>
      </div>
    </>
  );
});


export const head: DocumentHead = {
  title: '調課用',
};
