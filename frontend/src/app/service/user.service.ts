import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Defualt values
  private defaultMode = 'c_cpp';
  private defaultTheme = 'monokai';

  // Todo: Fetched From server
  private userPreferedMode = undefined;
  private userPreferedTheme = undefined;

  private choosen = {
    mode: this.userPreferedMode || this.defaultMode,
    theme: this.userPreferedTheme || this.defaultTheme
  };

  constructor() { }

  getMode() { return this.choosen['mode']; }
  // Todo: update in sevrer
  setMode(mode: String) { this.choosen['mode'] = mode; }

  getTheme() { return this.choosen['theme']; }
  // Todo: update in server
  setTheme(theme: string) { this.choosen['theme'] = theme; }

  // Todo: Fetch from server
  getCodes(): any {
    return [
      {
        caption: 'Dijkstra',
        link: 'xyz'
      },
      {
        caption: 'Prims MST',
        link: 'pyz'
      },
      {
        caption: 'Disjoint-Set-Union',
        link: 'pyr'
      },
      {
        caption: '0/1 Knapsack-DP',
        link: 'xyr'
      },
      {
        caption: 'Graham Scan',
        link: 'xqz'
      },
      {
        caption: 'Ford-Fulkerson Flow',
        link: 'pqr'
      },
      {
        caption: 'Bellmen-Ford',
        link: 'xqr'
      }
    ];
  }

  // Todo: run code on server
  getOutput(codeData) { return `Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis libero sunt ipsum at dolores eos quo tenetur sapiente esse. Magnam veniam praesentium atque quia minus, cumque incidunt omnis, beatae itaque, autem nihil assumenda necessitatibus hic voluptatem! Delectus maiores dignissimos itaque dolorem cumque facere? Iusto dolore, repellat ullam pariatur amet maxime molestiae asperiores, optio aperiam aut reprehenderit laborum natus voluptates architecto provident modi nesciunt ad, sit officiis libero voluptas! Laborum, eius. Excepturi aut quis, repudiandae eaque iure perspiciatis, unde nobis illo reprehenderit totam veniam doloremque nam iusto exercitationem! Aspernatur in incidunt voluptates expedita est optio veritatis perferendis dolores commodi, alias tempora nobis inventore exercitationem ullam corrupti. Ullam aliquid ut fuga, ratione placeat distinctio consequuntur voluptatem quia nulla sapiente maiores fugit perferendis, impedit ex eius. Reprehenderit molestias illo omnis ipsum in perferendis eveniet, nihil asperiores corporis quas tempore dignissimos, aspernatur veniam. Vero aliquid placeat nulla. Itaque, quod eveniet sunt placeat voluptatum earum quidem. Ab fugit, nihil aspernatur inventore ex enim vero, odio totam quasi obcaecati voluptatem dignissimos eius cumque sunt, deserunt quis dolor deleniti iusto excepturi quibusdam dicta doloribus corrupti? Hic reiciendis veniam esse enim maiores praesentium architecto illum! Provident in et hic, quia ab, tempore perferendis eius architecto eos, quas odit eveniet assumenda repellendus. Aliquam minima laborum inventore eveniet esse maiores corrupti laboriosam quidem voluptatum, consectetur reprehenderit, distinctio odit aut, doloremque accusantium nemo iusto impedit porro! At, dignissimos omnis velit similique placeat dicta neque distinctio, facilis corrupti minus maiores pariatur quas eaque autem natus corporis. Sunt maxime fugiat cumque delectus praesentium, velit laboriosam in nihil error voluptas neque voluptate libero voluptatibus qui reprehenderit dicta tempora corporis natus est iure animi ipsa quisquam. Excepturi labore earum ex, recusandae sapiente consequuntur aperiam reiciendis doloremque distinctio iusto, est atque debitis modi eaque soluta sed omnis? Dignissimos hic, libero nemo aliquam minima, deserunt perferendis repellat pariatur vero non labore expedita adipisci eum perspiciatis cum enim nesciunt debitis? Ratione unde porro soluta similique saepe explicabo esse ab eos eum sunt quis dolores ea iusto ad dolorum animi magnam labore ut, id facilis. Velit, sed eveniet veniam ea repellat minima. Repudiandae quam earum distinctio minus culpa qui dolorum consectetur explicabo ad mollitia dignissimos corrupti beatae debitis ullam soluta eos labore, nobis facere magnam illo ipsam iste omnis. Necessitatibus suscipit optio dolore illum eos minima facere, asperiores eius corporis corrupti dolores beatae. Ipsam, unde repellat, consequatur quos cupiditate suscipit amet quasi nisi reiciendis itaque ipsa quibusdam sed doloribus eum nam nihil praesentium possimus quidem distinctio aperiam voluptatibus doloremque voluptate dolores natus. Tenetur porro explicabo quidem quasi distinctio tempore harum sint aspernatur. Ad praesentium esse, non fugit, odio debitis maxime nihil quibusdam dicta excepturi cupiditate harum rerum dolorum iusto obcaecati totam quod adipisci labore consectetur, veniam quidem modi molestiae eum. Esse fugiat nihil consectetur dolorem voluptas optio facilis veritatis exercitationem modi repellendus nesciunt porro consequatur recusandae, itaque repellat iusto soluta cumque ex. Laudantium, molestias explicabo ad reprehenderit officiis atque odit, alias, commodi consequuntur iusto dolorem placeat aut libero aliquam voluptatum minima delectus temporibus dolorum expedita repellendus mollitia blanditiis! Itaque.`; }
}
