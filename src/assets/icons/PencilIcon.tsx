import type { ColorIconProps } from './types';

/**
 * ✏️ PencilIcon (연필 아이콘)
 *
 * 기본적으로 회색을 사용하며, 다른 색상을 원하면 `color` prop을 사용하세요.
 *
 * @component
 * @param {number} [size=22] - 아이콘의 너비 (상수값으로 입력해야 함.)
 * @param {string} [color='var(--color-white)'] - 아이콘 색상 (HEX, CSS 변수 모두 가능)
 * @param {React.SVGProps<SVGSVGElement>} props - 기타 SVG 속성 (예: className, aria-label 등)
 *
 * @example
 * // 기본 사용 (회색)
 * <PencilIcon />
 *
 * @example
 * // 커스텀 색상 적용
 * <PencilIcon color="#d2d2d2" size={20} />
 * @example
 * //Tailwind에서 정의한 CSS 변수 사용
 * <PencilIcon color="var(--color-gray-300)" />
 */

const PencilIcon = ({ size = 22, color = 'var(--color-white)', ...props }: ColorIconProps) => {
  return (
    <svg fill='none' height={size} viewBox='0 0 22 22' width={size} {...props} xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M1.50484 21.6249C1.18474 21.6249 0.916416 21.5167 0.699874 21.3001C0.483311 21.0836 0.375031 20.8152 0.375031 20.4951V18.3293C0.375031 18.0245 0.43353 17.7339 0.55053 17.4577C0.66751 17.1814 0.828562 16.9407 1.03369 16.7356L16.863 0.913469C17.0521 0.741782 17.2608 0.609114 17.4892 0.515469C17.7176 0.421823 17.9571 0.375 18.2077 0.375C18.4583 0.375 18.7011 0.41948 18.936 0.508438C19.171 0.597376 19.379 0.738792 19.5601 0.932688L21.0865 2.47834C21.2804 2.65943 21.4186 2.8678 21.5012 3.10347C21.5837 3.33912 21.625 3.57476 21.625 3.81041C21.625 4.06176 21.582 4.30164 21.4962 4.53003C21.4104 4.75845 21.2738 4.96717 21.0865 5.15619L5.26437 20.9663C5.05925 21.1714 4.81856 21.3325 4.54231 21.4494C4.26604 21.5664 3.97549 21.6249 3.67066 21.6249H1.50484ZM17.9399 5.61775L19.75 3.81966L18.1803 2.24997L16.3822 4.06006L17.9399 5.61775Z'
        fill={color}
      />
    </svg>
  );
};

export default PencilIcon;
