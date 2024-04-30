import { getLabelInfo } from 'sirius-next/packages/common/dist/components/AddressContainer/label';
import { AddressContainer } from 'sirius-next/packages/common/dist/components/AddressContainer';
export { getLabelInfo, AddressContainer };

// export const getLabelInfo = (label, type) => {
//   if (label) {
//     let trans: string = '';
//     let icon: React.ReactNode = null;

//     if (type === 'tag') {
//       trans = translations.profile.tip.label;
//       icon = <Bookmark color="var(--theme-color-gray2)" size={16} />;
//     } else if (type === 'ens') {
//       trans = translations.ens.label;
//       icon = (
//         <img
//           src={ICON_ENS}
//           style={{
//             marginBottom: '3px',
//             marginRight: '2px',
//           }}
//           alt=""
//         />
//       );
//       // nametag from official operational staff
//     } else if (type === 'nametag') {
//       trans = translations.nametag.label;
//       icon = <Hash color="var(--theme-color-gray2)" size={16} />;
//     }

//     // change different label with different style
//     // label = <mark>{label}</mark>

//     return {
//       label,
//       icon: (
//         <IconWrapper>
//           <Text span hoverValue={<Translation>{t => t(trans)}</Translation>}>
//             {icon}
//           </Text>
//         </IconWrapper>
//       ),
//     };
//   }

//   return {
//     label: '',
//     icon: null,
//   };
// };

// ≈ 2.5 ms
// const RenderAddress = ({
//   cfxAddress,
//   alias,
//   hoverValue,
//   hrefAddress,
//   content,
//   link = true,
//   isFull = false,
//   isFullNameTag = false,
//   style = {},
//   maxWidth,
//   suffixSize = defaultPCSuffixAddressSize,
//   prefix = null,
//   suffix = null,
//   type = 'pow',
//   addressLabel = '',
//   ENSLabel = '',
//   nametag = '',
// }: any) => {
//   const aftercontent =
//     type === 'pow'
//       ? cfxAddress &&
//         !isFull &&
//         !ENSLabel &&
//         !nametag &&
//         !addressLabel &&
//         !alias
//         ? cfxAddress.substr(-suffixSize)
//         : ''
//       : '';

//   let text: React.ReactNode = null;

//   if (link) {
//     if (typeof link === 'string') {
//       text = (
//         <LinkWrapper
//           style={style}
//           href={link}
//           maxwidth={
//             (content || alias) && isFullNameTag ? 1000 : isFull ? 430 : maxWidth
//           }
//           alias={alias}
//           aftercontent={aftercontent}
//         >
//           <span>{content || alias || cfxAddress}</span>
//         </LinkWrapper>
//       );
//     } else {
//       const href = `/${type === 'pow' ? 'address' : 'pos/accounts'}/${
//         hrefAddress || cfxAddress
//       }`;
//       text = (
//         <LinkWrapper
//           style={style}
//           href={href}
//           maxwidth={
//             (content || ENSLabel || nametag || addressLabel || alias) &&
//             isFullNameTag
//               ? 1000
//               : isFull
//               ? 430
//               : maxWidth
//           }
//           alias={alias}
//           aftercontent={aftercontent}
//         >
//           <span>
//             {content ||
//               ENSLabel ||
//               nametag ||
//               addressLabel ||
//               alias ||
//               cfxAddress}
//           </span>
//         </LinkWrapper>
//       );
//     }
//   } else {
//     text = (
//       <PlainWrapper
//         style={style}
//         maxwidth={
//           (content || ENSLabel || nametag || addressLabel || alias) &&
//           isFullNameTag
//             ? 1000
//             : isFull
//             ? 430
//             : maxWidth
//         }
//         alias={alias}
//         aftercontent={aftercontent}
//       >
//         <span>
//           {content ||
//             ENSLabel ||
//             nametag ||
//             addressLabel ||
//             alias ||
//             cfxAddress}
//         </span>
//       </PlainWrapper>
//     );
//   }

//   return (
//     <AddressWrapper>
//       {prefix}
//       <Text
//         span
//         hoverValue={
//           <>
//             {ENSLabel ? (
//               <div>
//                 <span>
//                   <Translation>{t => t(translations.ens.tip)}</Translation>
//                 </span>
//                 {ENSLabel}
//               </div>
//             ) : null}
//             {nametag ? (
//               <div>
//                 <span>
//                   <Translation>{t => t(translations.nametag.tip)}</Translation>
//                 </span>
//                 {nametag}
//               </div>
//             ) : null}
//             {addressLabel ? (
//               <div>
//                 <span>
//                   <Translation>
//                     {t => t(translations.profile.address.myNameTag)}
//                   </Translation>
//                 </span>
//                 {addressLabel}
//               </div>
//             ) : null}
//             {alias ? (
//               <>
//                 <span>
//                   <Translation>
//                     {t => t(translations.profile.address.publicNameTag)}
//                   </Translation>
//                 </span>
//                 {alias}
//               </>
//             ) : null}
//             <div>{hoverValue || cfxAddress}</div>
//           </>
//         }
//       >
//         {text}
//       </Text>
//       {suffix}
//     </AddressWrapper>
//   );
// };

// export const AddressContainer = withTranslation()(
//   React.memo(
//     ({
//       value,
//       alias,
//       contractCreated,
//       maxWidth,
//       isFull = false,
//       isFullNameTag = false,
//       link = true,
//       isMe = false,
//       suffixAddressSize,
//       showIcon = true,
//       t,
//       verify = false,
//       isEspaceAddress,
//       showAddressLabel = true,
//       showENSLabel = true,
//       showNametag = true,
//       ensInfo,
//       nametag,
//       nametagInfo,
//     }: Props & WithTranslation) => {
//       const [globalData = {}] = useGlobalData();

//       let ENSMap = {};

//       if (ensInfo) {
//         ENSMap = ensInfo;
//       } else {
//         // try to get ens name
//         const [m] = useENS({
//           // @ts-ignore
//           address: value || contractCreated ? [value || contractCreated] : [],
//         });

//         ENSMap = m;
//       }

//       const suffixSize =
//         suffixAddressSize ||
//         (window.innerWidth <= sizes.m
//           ? defaultMobileSuffixAddressSize
//           : defaultPCSuffixAddressSize);

//       // check if the address is a contract create address
//       if (!value) {
//         const txtContractCreation = t(
//           translations.transaction.contractCreation,
//         );

//         if (contractCreated) {
//           const fContractCreated = formatAddress(contractCreated);

//           // official name tag
//           let officalNametag: React.ReactNode = null;
//           // private name tag
//           let addressLabel: React.ReactNode = null;
//           // ens name tag
//           let ENSLabel: React.ReactNode = null;
//           // global ens name tag
//           const gENSLabel = ENSMap[fContractCreated]?.name;
//           // global private name tag
//           const gAddressLabel =
//             globalData[LOCALSTORAGE_KEYS_MAP.addressLabel][fContractCreated];

//           if (showAddressLabel && gAddressLabel) {
//             const { label } = getLabelInfo(gAddressLabel, 'tag');

//             addressLabel = label;
//           }

//           if (showNametag && nametagInfo?.[fContractCreated]?.nametag) {
//             const { label } = getLabelInfo(
//               nametagInfo[fContractCreated].nametag,
//               'nametag',
//             );

//             officalNametag = label;
//           }

//           if (showENSLabel && gENSLabel) {
//             const { label } = getLabelInfo(gENSLabel, 'ens');

//             ENSLabel = label;
//           }

//           return RenderAddress({
//             content: txtContractCreation,
//             cfxAddress: '',
//             alias: alias,
//             addressLabel,
//             nametag: officalNametag,
//             ENSLabel,
//             hoverValue: fContractCreated,
//             hrefAddress: fContractCreated,
//             link,
//             isFull,
//             isFullNameTag,
//             maxWidth: 160,
//             suffixSize,
//             prefix: (
//               <IconWrapper>
//                 <Text span hoverValue={txtContractCreation}>
//                   <img src={ContractIcon} alt={txtContractCreation} />
//                 </Text>
//               </IconWrapper>
//             ),
//           });
//         }

//         // If a txn receipt has no 'to' address or 'contractCreated', show -- for temp
//         return <>--</>;
//       }

//       if (isEspaceAddress) {
//         const tip = t(translations.general.eSpaceAddress);
//         const hexAddress = SDK.format.hexAddress(value);
//         const networkId =
//           ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_MAINNET
//             ? 1030
//             : 71;
//         const network = getNetwork(globalData.networks, networkId);
//         const url = `${window.location.protocol}${network.url}/address/${hexAddress}`;

//         return RenderAddress({
//           cfxAddress: hexAddress,
//           alias: formatString(hexAddress, 'hexAddress'),
//           hoverValue: hexAddress,
//           link: url,
//           isFull,
//           maxWidth,
//           suffixSize: 0,
//           prefix: (
//             <IconWrapper>
//               <Text span hoverValue={tip}>
//                 <File size={16} color="#17B38A" />
//               </Text>
//             </IconWrapper>
//           ),
//         });
//       }

//       // check if the address is a valid conflux address
//       if (!isAddress(value)) {
//         const tip = t(translations.general.invalidAddress);

//         return RenderAddress({
//           cfxAddress: value,
//           alias,
//           hoverValue: `${tip}: ${value}`,
//           content: alias ? formatString(alias, 'tag') : value,
//           link: false,
//           isFull,
//           isFullNameTag,
//           maxWidth,
//           suffixSize,
//           style: { color: '#e00909' },
//           prefix: (
//             <IconWrapper>
//               <Text span hoverValue={tip}>
//                 <AlertTriangle size={16} color="#e00909" />
//               </Text>
//             </IconWrapper>
//           ),
//         });
//       }

//       const cfxAddress = formatAddress(value);

//       // zero address auto set alias
//       if (!alias && isZeroAddress(cfxAddress)) {
//         alias = t(translations.general.zeroAddress);
//       }

//       let prefixIcon: React.ReactNode = null;
//       // official name tag
//       let officalNametag: React.ReactNode = null;
//       // private name tag
//       let addressLabel: React.ReactNode = null;
//       // ens name tag
//       let ENSLabel: React.ReactNode = null;
//       // global ens name tag
//       const gENSLabel = ENSMap[cfxAddress]?.name;
//       // global private name tag
//       const gAddressLabel =
//         globalData[LOCALSTORAGE_KEYS_MAP.addressLabel][cfxAddress];

//       if (showAddressLabel && gAddressLabel) {
//         const { label } = getLabelInfo(gAddressLabel, 'tag');

//         addressLabel = label;
//       }

//       if (showNametag && nametagInfo?.[cfxAddress]?.nametag) {
//         const { label } = getLabelInfo(
//           nametagInfo[cfxAddress].nametag,
//           'nametag',
//         );

//         officalNametag = label;
//       }

//       if (showENSLabel && gENSLabel) {
//         const { label, icon } = getLabelInfo(gENSLabel, 'ens');

//         ENSLabel = label;
//         prefixIcon = icon;
//       }

//       if (isContractAddress(cfxAddress) || isInnerContractAddress(cfxAddress)) {
//         const typeText = t(
//           isInnerContractAddress(cfxAddress)
//             ? translations.general.internalContract
//             : verify
//             ? translations.general.verifiedContract
//             : translations.general.unverifiedContract,
//         );

//         return RenderAddress({
//           cfxAddress,
//           alias,
//           addressLabel,
//           ENSLabel,
//           nametag: officalNametag,
//           link,
//           isFull,
//           isFullNameTag,
//           maxWidth,
//           suffixSize,
//           prefix: showIcon ? (
//             <IconWrapper className={`${isFull ? 'icon' : ''}`}>
//               {prefixIcon}
//               <Text span hoverValue={typeText}>
//                 <ImgWrapper>
//                   {isInnerContractAddress(cfxAddress) ? (
//                     <img src={InternalContractIcon} alt={typeText} />
//                   ) : (
//                     <>
//                       <img src={ContractIcon} alt={typeText} />
//                       {verify ? (
//                         <img
//                           className={'verified'}
//                           src={VerifiedIcon}
//                           alt={''}
//                         />
//                       ) : null}
//                     </>
//                   )}
//                 </ImgWrapper>
//               </Text>
//             </IconWrapper>
//           ) : null,
//         });
//       }

//       if (isMe) {
//         return RenderAddress({
//           cfxAddress,
//           alias,
//           addressLabel,
//           ENSLabel,
//           nametag: officalNametag,
//           link,
//           isFull,
//           isFullNameTag,
//           maxWidth,
//           suffixSize,
//           suffix: (
//             <IconWrapper>
//               <img
//                 src={isMeIcon}
//                 alt="is me"
//                 style={{
//                   width: 38.5,
//                   marginLeft: 3,
//                   marginBottom: isFull ? 6 : 4,
//                 }}
//               />
//             </IconWrapper>
//           ),
//         });
//       }

//       return RenderAddress({
//         cfxAddress,
//         alias,
//         addressLabel,
//         ENSLabel,
//         nametag: officalNametag,
//         link,
//         isFull,
//         isFullNameTag,
//         maxWidth,
//         suffixSize,
//         prefix: prefixIcon,
//       });
//     },
//   ),
// );

// export const PoSAddressContainer = withTranslation()(
//   React.memo(
//     ({
//       value,
//       alias,
//       maxWidth,
//       isFull = false,
//       isFullNameTag,
//       link = true,
//       isMe = false,
//       suffixAddressSize,
//       t,
//     }: Props & WithTranslation) => {
//       const suffixSize =
//         suffixAddressSize ||
//         (window.innerWidth <= sizes.m
//           ? defaultMobileSuffixAddressSize
//           : defaultPCSuffixPosAddressSize);

//       if (!value) {
//         return <>--</>;
//       }

//       // first check if the address is a valid conflux address
//       if (!isPosAddress(value)) {
//         const tip = t(translations.general.invalidPosAddress);
//         return RenderAddress({
//           cfxAddress: value,
//           alias,
//           hoverValue: `${tip}: ${value}`,
//           content: alias
//             ? formatString(alias, 'tag')
//             : formatString(value, 'posAddress'),
//           link: false,
//           isFull,
//           isFullNameTag,
//           maxWidth,
//           suffixSize,
//           style: { color: '#e00909' },
//           prefix: (
//             <IconWrapper>
//               <Text span hoverValue={tip}>
//                 <AlertTriangle size={16} color="#e00909" />
//               </Text>
//             </IconWrapper>
//           ),
//           type: 'pos',
//         });
//       }

//       const content = formatString(value, 'posAddress');

//       // if (!alias) {
//       //   alias = CONTRACTS_NAME_LABEL[cfxAddress]; // may use later
//       // }

//       if (isMe) {
//         return RenderAddress({
//           cfxAddress: value,
//           alias,
//           link,
//           isFull,
//           isFullNameTag,
//           maxWidth,
//           suffixSize,
//           suffix: (
//             <IconWrapper>
//               <img
//                 src={isMeIcon}
//                 alt="is me"
//                 style={{
//                   width: 38.5,
//                   marginLeft: 3,
//                   marginBottom: isFull ? 6 : 4,
//                 }}
//               />
//             </IconWrapper>
//           ),
//           content: content,
//           type: 'pos',
//         });
//       }

//       return RenderAddress({
//         cfxAddress: value,
//         alias,
//         link,
//         isFull,
//         isFullNameTag,
//         maxWidth,
//         suffixSize,
//         type: 'pos',
//         content: content,
//       });
//     },
//   ),
// );
