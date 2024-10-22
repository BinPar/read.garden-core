import { buttonType } from '@/types/buttons';
import { setConfig } from '@/utils/config';

import setup from '@/utils/setup';

const lines =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna at risus facilisis aliquam. Sed id elit non nisi elementum dictum. Integer cursus vel nibh ut hendrerit. Integer et nibh risus. Pellentesque vitae purus eros. Etiam porttitor lectus est. Etiam eleifend rutrum libero. Etiam hendrerit metus justo, ut commodo enim scelerisque sit amet. Nullam ut iaculis justo. Mauris ipsum mi, efficitur sit amet ipsum ac, fringilla cursus velit. Mauris velit sapien, suscipit non ante id, viverra accumsan nibh. Cras iaculis ex at gravida laoreet. Proin sit amet egestas erat.
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut vitae laoreet purus, in suscipit eros. Sed ut mi nec nunc mattis tristique. Vestibulum pellentesque vel metus in accumsan. Curabitur lobortis ultrices ultricies. Phasellus id metus nec orci molestie imperdiet. Mauris ultricies facilisis sem, pharetra maximus arcu tempus id.
Fusce sit amet enim porta, interdum neque a, placerat sapien. Donec ornare dolor id nibh egestas, sed facilisis sem tristique. Integer vitae urna non sem ultricies vulputate ac dignissim metus. Ut commodo quis nisl a venenatis. Ut a risus non mi pretium consectetur feugiat quis neque. Duis sagittis pretium elit nec porta. Integer vitae ante ac orci dictum commodo. Phasellus ornare convallis orci quis imperdiet. Fusce consectetur dolor leo, sit amet ornare arcu vulputate eget. Suspendisse cursus tortor vel sapien iaculis, placerat rhoncus quam congue. Phasellus sodales cursus odio eget mattis. Duis velit diam, ornare in augue in, gravida tristique nisl. Nullam quis commodo risus, a facilisis magna. Curabitur sed elementum quam, eu facilisis lacus. Donec finibus magna sit amet nibh pellentesque, et vestibulum purus mattis. Morbi imperdiet varius lorem quis tristique.
Quisque venenatis tincidunt tortor id rutrum. Etiam ut vulputate dolor. Mauris congue ex vel erat blandit, in hendrerit neque commodo. Donec eu libero dictum, placerat dui eu, vehicula felis. Ut neque purus, dictum feugiat lacus hendrerit, semper mollis lacus. Praesent ultrices suscipit risus vel molestie. Suspendisse in sagittis tellus. Maecenas semper, nisl nec sollicitudin interdum, elit sem ullamcorper diam, sed interdum ipsum neque et eros. Donec consectetur, mauris id porta maximus, dolor augue molestie nulla, id mattis ante urna ut augue.
Pellentesque sed sagittis felis, quis aliquam tortor. Vestibulum vitae justo non est cursus accumsan. Morbi fermentum ipsum odio, non aliquet ante interdum sit amet. Donec in ullamcorper leo. Integer convallis, risus vel pellentesque vehicula, sapien dui malesuada risus, ac vehicula arcu lacus ut eros. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras erat leo, sodales vel lorem sed, placerat pulvinar erat. Etiam efficitur nulla nec augue consequat fringilla. Vivamus viverra vel erat a convallis.
Phasellus consequat bibendum accumsan. In facilisis ex eget luctus facilisis. Quisque ullamcorper ex purus. Sed orci eros, rutrum ut justo eget, lacinia fringilla mauris. Nunc sapien turpis, malesuada vitae felis id, scelerisque aliquam velit. Nulla ut erat ante. Cras accumsan venenatis ante ac hendrerit. Phasellus nunc nunc, cursus nec faucibus semper, vestibulum nec urna. Cras scelerisque id sem vel sollicitudin. Pellentesque viverra eu lectus vitae dapibus. Mauris et augue in metus elementum viverra. Suspendisse convallis elit augue, a blandit lorem tempus vel. Suspendisse nibh diam, feugiat eget molestie id, blandit id nulla.
Nulla ut congue arcu. Aliquam erat volutpat. Aliquam finibus lectus est, ac luctus lectus convallis eu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam tincidunt justo vel nisi blandit rhoncus. Suspendisse lobortis tristique sem id finibus. Donec non nulla quis nisl congue aliquam quis quis dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus at cursus augue. Mauris nec suscipit ante, a egestas lacus. Suspendisse potenti.
Integer auctor diam aliquet arcu luctus, sed rhoncus sem dapibus. In justo arcu, pellentesque in tortor ac, condimentum luctus quam. Nullam rutrum eros eget malesuada euismod. Curabitur maximus facilisis mauris. Sed eget urna quis tortor scelerisque viverra ut ac purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut turpis purus, dignissim eu lacus sit amet, tristique eleifend risus.
Duis interdum lacus eros, at cursus tortor elementum a. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur pharetra facilisis ornare. Nam rhoncus eros nec odio aliquet, vitae pulvinar leo ornare. Aenean nec nunc finibus magna venenatis eleifend quis vel risus. Nam et turpis eget dui accumsan commodo sed et erat. Sed sed tellus auctor, vehicula nibh et, semper nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo at est varius efficitur. Aenean vitae magna ac mauris tempus imperdiet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
Sed pulvinar porttitor nisl, sed convallis justo viverra eget. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas euismod interdum justo et suscipit. Sed a dignissim lacus. In hac habitasse platea dictumst. Aenean luctus purus quis urna tincidunt interdum. Nulla sagittis leo in mattis posuere. Quisque nec placerat metus, quis auctor magna. Ut condimentum `.split(
    '\n',
  );

const contents = 1000;

window.onload = () => {
  const config = setup({
    layout: 'flow',
    options: {
      fontSize: 16,
      buttons: [
        {
          text: '<',
          type: buttonType.enum.backward,
        },
        {
          text: '>',
          type: buttonType.enum.forward,
        },
      ],
    },
  });

  setConfig(config);

  console.log({ config });

  document.body.classList.add(config.layout);

  for (let i = 0; i < contents; i++) {
    lines.forEach((p) => {
      const div = document.createElement('div');
      div.textContent = p;
      document.body.appendChild(div);
    });
  }

  console.log({
    window,
    outer: window.parent,
    mainWindow: window.parent.parent,
  });

  window.test = () => {
    console.log('test window');
  };

  window.parent.test = () => {
    console.log('test window.parent');
  };

  window.parent.parent.test = () => {
    console.log('test window.parent.parent');
  };
};
