import { component$, useStore, useStylesScoped$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { Env, Teacher } from '~/logic/Tuning';
import { clean, Elements, Setting } from './setting';

import styles from './table.css?inline';

export class Global {
  env: Env
  sols: Env[] = [];
  setting: Setting;
  constructor() {
    this.env = new Env();
    this.sols = []
    this.setting = new Setting()
  }

  reload(text: string) {
    _global.setting = Setting.load(text)
    _global.env = new Env()
    _global.env.setCourses(_global.setting.courses)
    _global.env.setDays(_global.setting.days)

    _global.setting.reload(_global.env)
  }

  set days(days: number) {
    this.setting.days = days
    this.env.setDays(days)
    this.setting.cleanAll()
  }
  set courses(courses: number) {
    this.setting.courses = courses
    this.env.setCourses(courses)
    this.setting.cleanAll()
  }
  set isOrder(isOrder: Boolean) {
    this.setting.isOrder = isOrder
    this.setting.cleanAll()
  }
  set steps(steps: number) {
    this.setting.steps = steps
    this.setting.cleanAll()
  }
  set teachers(teachers: { [key: string]: string }) {
    this.setting.teachers = teachers
    this.setting.cleanAll()
  }
}

export const _global: Global = new Global();

export default component$(() => {
  useStylesScoped$(styles);

  const store = useStore({
    /// 所有老師
    // teachers: new Array<string>(),
    /// 選中老師名稱
    sTeacher: '',

    /// 被選中的課堂
    index: 0,

    sol: '',

    cookie: '',
  });

  return (
    <>
      <div>
        <h1 style='color:#e33'>不會對班級名稱為 `x` 或 `X` 進行調課</h1>
        <div class={"row"}>
          <div class={"column"}>

            <h2>設定</h2>
            <hr />

            <p>Cookie</p>

            <button onClick$={() => {
              _global.setting.save()
              store.cookie = document.cookie
            }}>Save</button>
            <button onClick$={() => {
              _global.reload(document.cookie)
              store.cookie = document.cookie
            }}>Load</button>
            <button onClick$={() => {
              document.cookie = '0'
              _global.reload(document.cookie)
              store.cookie = document.cookie
            }}>Reset</button>

            <hr />

            <p>每週上課天數:
              <select id={Elements.selectDays} onChange$={(event) => {
                const v = event.target.value
                _global.days = +v
              }}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option selected value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
              </select>
            </p>

            <p>
              每天上課節數:
              <select id={Elements.selectCourses} onChange$={(event) => {
                const v = event.target.value
                _global.courses = +v
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
            </p>

            <p>星期排序:
              <select id={Elements.selectIsOrder} onChange$={(event) => {
                const v = event.target.value
                _global.isOrder = v === "1"
              }}>
                <option selected value={1}>正(一~日)</option>
                <option value={2}>反(日~一)</option>
              </select>
            </p>

            <p>最多連續調課 N 次:
              <select id={Elements.selectSteps} onChange$={(event) => {
                const v = event.target.value
                _global.steps = +v
              }}>
                <option value={1}>1</option>
                <option selected value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </p>

            <hr />

            <h4>請選擇檔案</h4>
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
                  _global.teachers = teachers
                } else {
                  _global.teachers = {}
                }

                for (const name in _global.setting.teachers) {
                  const raw = _global.setting.teachers[name]
                  _global.env.setup(name, raw)
                }

                const s = document.getElementById(Elements.selectTeacher)
                for (const t of _global.env.teachers()) {
                  const opt = document.createElement('option');
                  opt.value = t;
                  opt.innerHTML = t;
                  s?.appendChild(opt);
                }
              }}
            />

            <hr />

            <p>請選擇老師(自己)</p>
            <select size={5} id={Elements.selectTeacher} onChange$={(event) => {

              const t = event.target.value
              store.sTeacher = t
              const teacher = new Teacher(t)
              // const a = env.findByTeacher(teacher).map((t) => t.toString())

              const table = document.getElementById(Elements.originTable)!
              // if (table) {
              _global.env.renderTable(table, teacher, _global.setting.isOrder, (num, cell) => {
                const previous = document.getElementById(`o${store.index}`)
                if (previous) {
                  previous.style.background = '#fff'
                }
                store.index = num
                cell.style.background = '#cc0'

                _global.sols = _global.env.change(teacher, num, _global.setting.steps)
                  .sort((l, r) => l.changes.length - r.changes.length)
                clean(Elements.toTable)
                clean(Elements.selectSol)
                store.sol = ''

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
                    option.innerHTML = `[結果 ${index + 1}]-${sol.changes.length}步驟`
                    s?.appendChild(option)
                  }
                  // const table2 = document.getElementById('toTable')

                  // if (table2)
                  //   sols[0].renderTable2(table2, teacher)
                }
              })
              // }
            }}>
            </select>

            <hr />

            <p>請選擇調課結果</p>
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
            <h2>原課表</h2>
            <table id={Elements.originTable}></table>

            <h2>調課後課表</h2>
            <table id={Elements.toTable}></table>
          </div>
        </div>

        <hr />
        <h4>Debug 訊息</h4>
        <p>index: {store.index}</p>
        <p>sols: {store.sol}</p>
        <p>document.cookie = '{store.cookie}'</p>
      </div>
    </>
  );
});


export const head: DocumentHead = {
  title: '調課用',
};
