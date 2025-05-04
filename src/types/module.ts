export enum ModuleStatus {
  PUBLISHED = 1, // 正常展示
  DRAFT, // 添加了但不展示
  DELETED, // 已删除，支持后续可以恢复
}
